import React, { useState, useRef } from "react";
import classNames from "classnames/bind";
import styles from "./ReactionPicker.module.css";
import { reactMessage } from "../../../services/chat/reactMessage";
import { FaRegSmile } from "react-icons/fa";

// import dùng chung
import { useReactions } from "../../../hooks/useReactions";

// IMPORT REDUX
import { useDispatch, useSelector } from "react-redux";
import { UpdateReactionMessage } from "../../../redux/chatSlice";

const cx = classNames.bind(styles);

function ReactionPicker({ messageId, currentReaction, isMine }) {
  const [showMenu, setShowMenu] = useState(false);
  const closeTimer = useRef(null);

  // values called from hook
  const { reactions } = useReactions();

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
              <img
                src={r.icon}
                alt={r.type}
                style={{ width: "42px", height: "42px", objectFit: "contain" }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReactionPicker;
