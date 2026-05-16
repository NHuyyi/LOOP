import React from "react";
import style from "./MenuConversation.module.css";
import classNames from "classnames/bind";
import { X, Pen, Search, Bell, User } from "lucide-react";

const cx = classNames.bind(style);

function MenuConverSation({ isOpen, onClose, otherUser, isOnline }) {
  if (!isOpen || !otherUser) return null;

  return (
    <div className={cx("overlay")} onClick={onClose}>
      <div
        className={cx("menu")}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className={cx("header")}>
          Thông tin cuộc trò chuyện
          <button className={cx("closeBtn")} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className={cx("content")}>
          <div className={cx("userInfo")}>
            <div className={cx("avatarWrapper")}>
              <img
                src={
                  otherUser.avatar ||
                  "https://res.cloudinary.com/dpym64zg9/image/upload/v1755614090/raw_cq4nqn.png"
                }
                alt="avatar"
                className={cx("avatar", isOnline ? "online" : "offline")}
              />
              <span
                className={cx("statusDot", isOnline ? "online" : "offline")}
              />
            </div>
            <div className={cx("details")}>
              <div className={cx("name")}>{otherUser.name}</div>
              <div className={cx("editIcon")}>
                <Pen size={16} />
              </div>
            </div>
          </div>
          <div className={cx("actions")}>
            <button className={cx("actionBtn")}>
              <Bell size={24} />
            </button>
            <button className={cx("actionBtn")}>
              <User size={24} />
            </button>
            <button className={cx("actionBtn")}>
              <Search size={24} />
            </button>
          </div>
          <div className={cx("images")}>
            <h4 className={cx("sectionTitle")}>Ảnh </h4>
            <div className={cx("line")}></div>
            <div className={cx("imageGrid")}></div>
          </div>
          <div className={cx("Btn-group")}>
            <button className={cx("reportBtn")}>Báo cáo</button>
            <button className={cx("cancelBtn")}>Hạn chế</button>
            <button className={cx("deleteBtn")}>Xóa cuộc trò chuyện</button>
            <button className={cx("blockBtn")}>Chặn người dùng</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuConverSation;
