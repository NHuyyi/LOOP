import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./ProfileHeader.module.css";
// Import thêm các icon mới
import {
  Flame,
  Users,
  FileText,
  Heart,
  MessageCircle,
  Copy,
  Check,
} from "lucide-react";

const cx = classNames.bind(styles);

// Nhận thêm prop stats
function ProfileHeader({ friendData, stats }) {
  const [isCopied, setIsCopied] = useState(false);
  // Hash cứng tạo bợ chờ dữ liệu thật
  const mockStreak = {
    hash: "dummy_streak_hash_123456789",
    count: 15,
    isActive: true,
  };

  // Trích xuất dữ liệu, gán giá trị mặc định là 0 nếu chưa có
  const {
    totalFriends = 0,
    totalPosts = 0,
    totalReactions = 0,
    totalComments = 0,
  } = stats || {};

  const handleCopyCode = async () => {
    if (!friendData?.friendCode) return;
    try {
      await navigator.clipboard.writeText(friendData.friendCode);
      setIsCopied(true);

      // Sau 2 giây thì reset lại icon copy
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Không thể copy:", err);
    }
  };

  return (
    <div className={cx("header-section")}>
      {/* Ảnh bìa */}
      <div
        className={cx("cover-photo")}
        style={
          friendData?.profile?.coverPhoto
            ? {
                backgroundImage: `url(${friendData.profile.coverPhoto})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {}
        }
      ></div>

      <div className={cx("info-wrapper")}>
        <div className={cx("avatar-wrapper")}>
          <img
            src={
              friendData.avatar ||
              "https://res.cloudinary.com/dpym64zg9/image/upload/v1755614090/raw_cq4nqn.png"
            }
            alt={friendData.name}
            className={cx("avatar")}
          />
          {mockStreak.isActive && (
            <div
              className={cx("streak-badge", "floating-badge")}
              title="Streak"
            >
              <Flame size={16} color="#ff9800" />
              <span>{mockStreak.count}</span>
            </div>
          )}
        </div>

        <h2 className={cx("name")}>{friendData.name}</h2>
        <div className={cx("friend-code-wrapper")}>
          <span className={cx("code-label")}>Mã ID: </span>
          <span className={cx("code-value")}>{friendData.friendCode}</span>

          <div className={cx("copy-container")}>
            <button
              className={cx("copy-btn", { copied: isCopied })}
              onClick={handleCopyCode}
              title="Copy mã"
            >
              {isCopied ? <Check size={14} /> : <Copy size={14} />}
            </button>

            {/* Tooltip hiển thị "Đã chép" */}
            {isCopied && <span className={cx("copy-tooltip")}>Đã chép!</span>}
          </div>
        </div>

        {/* Vùng chứa thống kê dạng Pills hiện đại */}
        <div className={cx("stats-container")}>
          <div className={cx("stat-pill", "blue")} title="Tổng bạn bè">
            <div className={cx("icon-wrapper")}>
              <Users size={16} />
            </div>
            <span>{totalFriends} bạn bè</span>
          </div>

          <div className={cx("stat-pill", "purple")} title="Tổng bài viết">
            <div className={cx("icon-wrapper")}>
              <FileText size={16} />
            </div>
            <span>{totalPosts} bài viết</span>
          </div>

          <div className={cx("stat-pill", "red")} title="Tổng lượt tương tác">
            <div className={cx("icon-wrapper")}>
              <Heart size={16} />
            </div>
            <span>{totalReactions} lượt thích</span>
          </div>

          <div className={cx("stat-pill", "teal")} title="Tổng lượt bình luận">
            <div className={cx("icon-wrapper")}>
              <MessageCircle size={16} />
            </div>
            <span>{totalComments} bình luận</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
