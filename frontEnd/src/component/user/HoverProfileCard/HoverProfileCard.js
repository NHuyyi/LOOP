import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import classNames from "classnames/bind";
import styles from "./HoverProfileCard.module.css";
import ProfileActions from "../ProfileActions/ProfileActions";

const cx = classNames.bind(styles);

function HoverProfileCard({ userData, position, onMouseLeave, onMouseEnter, onModalClose }) {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.user);

  if (!userData) return null;

  const handleGoToProfile = () => {
    navigate(`/friend/${userData.id}`);
  };

  // Fake friendData cấu trúc mà ProfileActions cần
  const friendData = {
    _id: userData.id,
    name: userData.name,
    avatar: userData.avatar,
  };

  return (
    <div
      className={cx("hover-card-wrapper")}
      style={{
        top: position.y - 10, // Cách thẻ mention một đoạn
        left: position.x,
      }}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
    >
      <div className={cx("card-content")}>
        <div className={cx("user-info")} onClick={handleGoToProfile}>
          <img
            src={userData.avatar || "/default-avatar.png"}
            alt={userData.name}
            className={cx("avatar")}
          />
          <span className={cx("name")}>{userData.name}</span>
        </div>

        {/* Nút thao tác profile */}
        <div className={cx("actions-wrapper")}>
          <ProfileActions friendData={friendData} currentUser={currentUser} onModalClose={onModalClose} />
        </div>
      </div>
    </div>
  );
}

export default HoverProfileCard;
