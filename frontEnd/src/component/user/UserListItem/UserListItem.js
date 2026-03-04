import React from "react";
import styles from "./UserListItem.module.css";
import classNames from "classnames/bind";
import { useSelector } from "react-redux";


const cx = classNames.bind(styles);

function UserListItem({ id, avatar, name, onClick }) {

  const onlineUsers = useSelector((state) => state.online);
  // Kiểm tra trạng thái online dựa trên ID nằm trong userData
  const isOnline = onlineUsers.includes(id);
  // Cung cấp ảnh mặc định nếu người dùng chưa cập nhật avatar
  const defaultAvatar =
    "https://res.cloudinary.com/dpym64zg9/image/upload/v1755614090/raw_cq4nqn.png";

  return (
    <div
      className={cx("user-item-container")}
      onClick={() => onClick && onClick({ avatar, name })}
    >
      <div className={cx("avatar-wrapper")}>
        <img
          src={avatar || defaultAvatar}
          alt={name || "Người dùng ẩn danh"}
          className={cx("user-avatar", { offline: !isOnline })}
        />
        <span className={cx("statusDot", isOnline ? "online" : "offline")} />
      </div>

      <div className={cx("user-info")}>
        <h4 className={cx("user-name")}>{name || "Người dùng ẩn danh"}</h4>
        {/* Chỗ này sau có thể dùng để hiển thị đoạn tin nhắn ngắn nhất hoặc trạng thái (ví dụ: "Đang hoạt động") */}
      </div>
    </div>
  );
}

export default UserListItem;
