import React, { useState, useRef } from "react";
import classNames from "classnames/bind";
import styles from "./MessageReaction.module.css";

import { reactMessage } from "../../../services/chat/reactMessage";

import {
  FaThumbsUp,
  FaHeart,
  FaLaugh,
  FaSurprise,
  FaSadTear,
  FaAngry,
  FaRegSmile,
} from "react-icons/fa";

const cx = classNames.bind(styles);

function MessageReaction({
  messageId,
  initialReaction,
  isMine,
  onReactionChange,
}) {
  const [currentReaction, setCurrentReaction] = useState(
    initialReaction || null,
  );
  const [showMenu, setShowMenu] = useState(false);
  const closeTimer = useRef(null);

  const reactions = [
    { type: "like", icon: <FaThumbsUp />, color: "#1877F2" },
    { type: "love", icon: <FaHeart />, color: "#F02849" },
    { type: "haha", icon: <FaLaugh />, color: "#FFD93D" },
    { type: "wow", icon: <FaSurprise />, color: "#2ECC71" },
    { type: "sad", icon: <FaSadTear />, color: "#1C8EFB" },
    { type: "angry", icon: <FaAngry />, color: "#E9710F" },
  ];

  const handleReaction = async (type) => {
    try {
      // cập nhật state ngay lập tức để UI phản hồi nhanh
      const newReaction = currentReaction === type ? null : type;
      setCurrentReaction(newReaction);
      setShowMenu(false);

      // BÁO CHO COMPONENT CHA (MessageList) BIẾT TRẠNG THÁI MỚI
      if (onReactionChange) {
        onReactionChange(newReaction);
      }
      const res = await reactMessage(messageId, type);

      if (!res.success) {
        setCurrentReaction(currentReaction);
        console.error(res.message || "Thêm phản ứng thất bại.");
      }
    } catch (error) {
      console.error("Lỗi khi thêm reaction:", error);
      setCurrentReaction(currentReaction);
    }
  };

  const handleMouseEnter = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setShowMenu(true);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => {
      setShowMenu(false);
    }, 400); // delay 0.4s trước khi đóng
  };

  let currentReactionObj;

  if (!currentReaction) {
    currentReactionObj = {
      type: "none",
      icon: <FaRegSmile />,
      color: "#888",
    };
  } else {
    currentReactionObj = reactions.find((r) => r.type === currentReaction);
  }

  const handleMainClick = () => {
    // Nếu chưa có reaction thì mặc định là "haha"
    if (!currentReaction) {
      handleReaction("haha");
    } else {
      // Nếu đã có reaction thì click lại vào nút chính => toggle (xoá reaction)
      handleReaction(currentReaction);
    }
  };

  return (
    <div
      className={cx("reaction-wrapper")}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={cx("main-button", { hasReaction: currentReaction })}
        style={{ color: currentReactionObj.color }}
        onClick={handleMainClick}
      >
        {currentReactionObj.icon}
      </button>

      {showMenu && (
        <div
          className={cx("reaction-menu", isMine ? "menu-right" : "menu-left")}
        >
          {reactions.map((reaction) => (
            <button
              key={reaction.type}
              className={cx("reaction-item", {
                active: currentReaction === reaction.type,
              })}
              onClick={() => handleReaction(reaction.type)}
              style={{ color: reaction.color }}
            >
              {reaction.icon}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default MessageReaction;
