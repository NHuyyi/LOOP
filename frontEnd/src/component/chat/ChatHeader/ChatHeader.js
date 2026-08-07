import React from "react";
import styles from "./ChatHeader.module.css";
import classNames from "classnames/bind";
import { Info } from "lucide-react";
import ChatStreak from "../ChatStreak/ChatStreak";

const cx = classNames.bind(styles);

// Nhận otherUser từ ChatPage truyền xuống
function ChatHeader({ onOpenModal, otherUser, streak = 0 }) {
  if (!otherUser) return null;

  return (
    <div className={cx("header")}>
      <div className={cx("userInfo")}>
        <img src={otherUser.avatar} alt="avatar" className={cx("avatar")} />
        <div className={cx("nameAndStatus")}>
          <h4>{otherUser?.name}</h4>
          {streak > 0 && <ChatStreak streak={streak} size="sm" />}
        </div>
      </div>
      <button className={cx("infoButton")} onClick={onOpenModal}>
        <Info className={cx("infoIcon")} size={24} />
      </button>
    </div>
  );
}

export default ChatHeader;
