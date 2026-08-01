import React from "react";
import classNames from "classnames/bind";
import styles from "../../../pages/FriendProfilePage/FriendProfilePage.module.css";
import { Flame } from "lucide-react";

const cx = classNames.bind(styles);

function ProfileHeader({ friendData }) {
  // Hash cứng tạo bợ chờ dữ liệu thật
  const mockStreak = {
    hash: "dummy_streak_hash_123456789",
    count: 15,
    isActive: true,
  };

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

      {/* Chuỗi (Streak) */}
      <div className={cx("streak-badge", { active: mockStreak.isActive })}>
        <Flame size={20} color={mockStreak.isActive ? "#ff9800" : "#ccc"} />
        <span>
          {mockStreak.count} ngày (Hash: {mockStreak.hash.substring(0, 8)}...)
        </span>
      </div>
    </div>
  );
}

export default ProfileHeader;
