import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./ProfileInfoCard.module.css";
import { 
  Phone, Calendar, MapPin, UserCircle2, 
  Lock, Flame, Briefcase, GraduationCap, 
  Link as LinkIcon, ExternalLink, Quote, Heart, Star, Image as ImageIcon 
} from "lucide-react";
// IMPORT MODEL ĐỂ MỞ ẢNH TO
import ModelPostMini from "../modelpostmini/modelpostmini"; 

const cx = classNames.bind(styles);

// Nhận thêm props 'posts' và 'currentUser'
function ProfileInfoCard({ profile, isOwner = false, streak = 0, posts = [], currentUser }) {
  const [activeTab, setActiveTab] = useState("basic");
  
  // State để quản lý popup khi click vào ảnh
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const UNLOCK_THRESHOLD = 10;
  const isUnlocked = isOwner || streak > UNLOCK_THRESHOLD;

  if (!profile) return null;

  // Lọc chỉ lấy các bài viết có hình ảnh
  const imagePosts = posts.filter(p => p.imageUrl);

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    try {
      return new Date(dateStr).toLocaleDateString("vi-VN", {
        day: "2-digit", month: "2-digit", year: "numeric",
      });
    } catch {
      return null;
    }
  };

  const renderSensitiveData = (value, fallbackMask, emptyText = "Chưa cập nhật") => {
    if (isUnlocked) {
      return value ? (
        <span className={cx("row-value")}>{value}</span>
      ) : (
        <span className={cx("row-value", "empty")}>{emptyText}</span>
      );
    }
    return value ? (
      <span className={cx("row-value", "locked")}>
        <Lock size={12} className={cx("lock-icon")} />
        {fallbackMask}
      </span>
    ) : (
      <span className={cx("row-value", "empty")}>{emptyText}</span>
    );
  };

  const daysLeft = Math.max(0, UNLOCK_THRESHOLD - streak);

  return (
    <div className={cx("profile-card-wrapper")}>
      
      {/* 1. KHỐI TIỂU SỬ */}
      <div className={cx("bio-section")}>
        <Quote size={16} className={cx("bio-icon")} />
        <p className={cx("bio-text", { empty: !profile.bio })}>
          {profile.bio ? `"${profile.bio}"` : "Chưa cập nhật tiểu sử"}
        </p>
      </div>

      {/* 2. THANH TAB ĐIỀU HƯỚNG */}
      <div className={cx("tabs-header")}>
        <button 
          className={cx("tab-item", { active: activeTab === "basic" })}
          onClick={() => setActiveTab("basic")}
        >
          Cơ bản
        </button>
        <button 
          className={cx("tab-item", { active: activeTab === "contact" })}
          onClick={() => setActiveTab("contact")}
        >
          Liên hệ
        </button>
        <button 
          className={cx("tab-item", { active: activeTab === "social" })}
          onClick={() => setActiveTab("social")}
        >
          Mạng xã hội
        </button>
        <button 
          className={cx("tab-item", { active: activeTab === "photos" })}
          onClick={() => setActiveTab("photos")}
        >
          Ảnh
        </button>
      </div>

      {/* 3. NỘI DUNG TỪNG TAB */}
      <div className={cx("tab-content")}>
        
        {/* TAB: CƠ BẢN */}
        {activeTab === "basic" && (
          <div className={cx("info-list")}>
            <div className={cx("info-row")}>
              <UserCircle2 size={18} className={cx("row-icon")} />
              <span className={cx("row-label")}>Giới tính:</span>
              <span className={cx("row-value")}>{profile.gender || "Bí mật"}</span>
            </div>
            
            <div className={cx("info-row")}>
              <Briefcase size={18} className={cx("row-icon")} />
              <span className={cx("row-label")}>Làm việc:</span>
              <span className={cx("row-value", { empty: !profile.workplace })}>
                {profile.workplace || "Chưa cập nhật"}
              </span>
            </div>
            
            <div className={cx("info-row")}>
              <GraduationCap size={18} className={cx("row-icon")} />
              <span className={cx("row-label")}>Học tại:</span>
              <span className={cx("row-value", { empty: !profile.education })}>
                {profile.education || "Chưa cập nhật"}
              </span>
            </div>

            <div className={cx("info-row")}>
              <Heart size={18} className={cx("row-icon")} />
              <span className={cx("row-label")}>Mối quan hệ:</span>
              <span className={cx("row-value")}>{profile.relationship || "Bí mật"}</span>
            </div>
            <div className={cx("info-row", "hobbies-row")}>
              <Star size={18} className={cx("row-icon")} />
              <span className={cx("row-label")}>Sở thích:</span>
              {profile.hobbies && profile.hobbies.length > 0 ? (
                <div className={cx("hobbies-container")}>
                  {profile.hobbies.map((hobby, index) => (
                    <span key={index} className={cx("hobby-chip")}>{hobby}</span>
                  ))}
                </div>
              ) : (
                <span className={cx("row-value", "empty")}>Chưa cập nhật</span>
              )}
            </div>
          </div>
        )}

        {/* TAB: LIÊN HỆ */}
        {activeTab === "contact" && (
          <div className={cx("info-list")}>
            {!isOwner && (
              <div className={cx("secure-status")}>
                <div className={cx("streak-badge", { unlocked: isUnlocked })}>
                  <Flame size={14} />
                  <span>{streak} ngày nhắn tin</span>
                </div>
              </div>
            )}

            <div className={cx("info-row")}>
              <Phone size={18} className={cx("row-icon")} />
              <span className={cx("row-label")}>Điện thoại:</span>
              {renderSensitiveData(profile.phoneNumber, "*** *** ****", "Chưa cập nhật")}
            </div>
            
            <div className={cx("info-row")}>
              <Calendar size={18} className={cx("row-icon")} />
              <span className={cx("row-label")}>Ngày sinh:</span>
              {renderSensitiveData(formatDate(profile.dateOfBirth), "**/**/****", "__/__/____")}
            </div>
            
            <div className={cx("info-row")}>
              <MapPin size={18} className={cx("row-icon")} />
              <span className={cx("row-label")}>Địa chỉ:</span>
              {renderSensitiveData(profile.location, "******", "Chưa cập nhật")}
            </div>

            {!isOwner && !isUnlocked && (
              <div className={cx("unlock-notice")}>
                <Lock size={14} />
                <p>Trò chuyện thêm <strong>{daysLeft} ngày</strong> để xem thông tin!</p>
              </div>
            )}
          </div>
        )}

        {/* TAB: LIÊN KẾT NGOÀI */}
        {activeTab === "social" && (
          <div className={cx("social-list")}>
            {profile.socialLinks && profile.socialLinks.length > 0 ? (
              profile.socialLinks.map((link, index) => (
                <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className={cx("social-item")}>
                  <LinkIcon size={16} />
                  <span className={cx("social-platform")}>{link.platform}</span>
                  <ExternalLink size={14} className={cx("external-icon")} />
                </a>
              ))
            ) : (
              <span className={cx("row-value", "empty")}>Chưa có liên kết nào</span>
            )}
          </div>
        )}

        {/* TAB: ẢNH */}
        {activeTab === "photos" && (
          <div className={cx("photos-list")}>
            {imagePosts.length > 0 ? (
              <div className={cx("photo-grid")}>
                {imagePosts.map(post => (
                  <div 
                    key={post._id} 
                    className={cx("photo-item")} 
                    onClick={() => { setSelectedPost(post); setIsModalOpen(true); }}
                  >
                    <img src={post.imageUrl} alt="post" />
                  </div>
                ))}
              </div>
            ) : (
              <div className={cx("empty-state")}>
                <ImageIcon size={48} className={cx("empty-icon")} />
                <p>Chưa có ảnh nào được đăng</p>
              </div>
            )}
          </div>
        )}

      </div>

      {/* POPUP XEM CHI TIẾT ẢNH */}
      {isModalOpen && selectedPost && (
        <ModelPostMini
          post={selectedPost}
          onClose={() => setIsModalOpen(false)}
          userID={currentUser} // Truyền đúng currentUser vào userID
        />
      )}
    </div>
  );
}

export default ProfileInfoCard;