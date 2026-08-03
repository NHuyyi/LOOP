import React from "react";
import classNames from "classnames/bind";
import styles from "../../../pages/FriendProfilePage/FriendProfilePage.module.css";
// Import thêm các icon mới
import { Flame, Users, FileText, Heart, MessageCircle } from "lucide-react";

const cx = classNames.bind(styles);

// Nhận thêm prop stats
function ProfileHeader({ friendData, stats }) {
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

  return (
    <div className={cx("header-section")}>
      <img
        src={
          friendData.avatar ||
          "https://res.cloudinary.com/dpym64zg9/image/upload/v1755614090/raw_cq4nqn.png"
        }
        alt={friendData.name}
        className={cx("avatar")}
      />
      <h2 className={cx("name")}>{friendData.name}</h2>
      <p className={cx("friend-code")}>Mã: {friendData.friendCode}</p>

      {/* VÙNG CHỨA CÁC THỐNG KÊ (NẰM NGANG) */}
      <div
        className={cx("stats-container")}
        style={{
          display: "flex",
          gap: "15px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Chuỗi (Streak) */}
        <div
          className={cx("streak-badge", { active: mockStreak.isActive })}
          title="Streak"
        >
          <Flame size={18} color={mockStreak.isActive ? "#ff9800" : "#ccc"} />
          <span>{mockStreak.count}</span>
        </div>

        {/* Tổng Bạn Bè */}
        <div className={cx("stat-badge")} title="Tổng bạn bè">
          <Users size={18} color="#0084ff" />
          <span>{totalFriends}</span>
        </div>

        {/* Tổng Bài Viết */}
        <div className={cx("stat-badge")} title="Tổng bài viết">
          <FileText size={18} color="#8c1af6" />
          <span>{totalPosts}</span>
        </div>

        {/* Tổng Reactions */}
        <div className={cx("stat-badge")} title="Tổng lượt tương tác">
          <Heart size={18} color="#e41e3f" />
          <span>{totalReactions}</span>
        </div>

        {/* Tổng Comments */}
        <div className={cx("stat-badge")} title="Tổng lượt bình luận">
          <MessageCircle size={18} color="#20b2aa" />
          <span>{totalComments}</span>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
