import React, { useState, useRef } from "react";
import classNames from "classnames/bind";
import styles from "./ReactionPicker.module.css";
import { reactMessage } from "../../../services/chat/reactMessage";
import {
  FaRegSmile,
  FaThumbsUp,
  FaHeart,
  FaLaugh,
  FaSurprise,
  FaSadTear,
  FaAngry,
} from "react-icons/fa";

// IMPORT REDUX
import { useDispatch, useSelector } from "react-redux";
import { UpdateReactionMessage } from "../../../redux/chatSlice";

const cx = classNames.bind(styles);

const reactions = [
  { type: "like", icon: <FaThumbsUp />, color: "#1877F2" },
  { type: "love", icon: <FaHeart />, color: "#F02849" },
  { type: "haha", icon: <FaLaugh />, color: "#FFD93D" },
  { type: "wow", icon: <FaSurprise />, color: "#2ECC71" },
  { type: "sad", icon: <FaSadTear />, color: "#1C8EFB" },
  { type: "angry", icon: <FaAngry />, color: "#E9710F" },
];

function ReactionPicker({ messageId, currentReaction, isMine }) {
  const [showMenu, setShowMenu] = useState(false);
  const closeTimer = useRef(null);

  // KẾT NỐI REDUX
  const dispatch = useDispatch();
  const activeConversationId = useSelector(
    (state) => state.chat.activeConversationId,
  );

  const handleReaction = async (type) => {
    try {
      setShowMenu(false);

      // 1. Gọi API lưu vào Database
      const res = await reactMessage(messageId, type);

      // 2. NẾU API THÀNH CÔNG -> CẬP NHẬT REDUX TỨC THÌ CHO CHÍNH CHỦ
      if (res && res.success) {
        dispatch(
          UpdateReactionMessage({
            messageId: messageId,
            reactions: res.reactions, // Dữ liệu xịn có kèm avatar/tên từ Backend trả về
            conversationId: activeConversationId,
          }),
        );
      }
    } catch (error) {
      console.error("Lỗi khi thêm reaction:", error);
    }
  };

  return (
    <div
      className={cx("picker-wrapper")}
      onMouseEnter={() => {
        clearTimeout(closeTimer.current);
        setShowMenu(true);
      }}
      onMouseLeave={() => {
        closeTimer.current = setTimeout(() => setShowMenu(false), 400);
      }}
    >
      <button
        className={cx("smile-btn")}
        style={{
          color: "#888",
        }}
        onClick={() => {
          if (currentReaction) {
            handleReaction(currentReaction);
          } else {
            handleReaction("haha");
          }
        }}
      >
        <FaRegSmile />
      </button>

      {showMenu && (
        <div
          className={cx("reaction-menu", isMine ? "menu-right" : "menu-left")}
        >
          {reactions.map((r) => (
            <button
              key={r.type}
              className={cx("reaction-item", {
                active: currentReaction === r.type,
              })}
              onClick={() => handleReaction(r.type)}
              style={{ color: r.color }}
            >
              {r.icon}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReactionPicker;
