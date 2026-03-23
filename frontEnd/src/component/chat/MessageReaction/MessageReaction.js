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
  allReactions,
  isMine,
  onReactionChange,
}) {
  const [currentReaction, setCurrentReaction] = useState(
    initialReaction || null,
  );
  const [showMenu, setShowMenu] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
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
  let countReactions = "";
  if (allReactions && allReactions.length === 2) {
    countReactions = "2";
  } else {
    // Nếu bạn muốn hiện số 1 thì sửa ở đây, không thì để trống
    countReactions = "";
  }

  return (
    <div
      className={cx("reaction-wrapper")}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={cx("main-button", { hasReaction: currentReaction })}
        style={{ color: currentReactionObj.color }}
        onClick={(e) => {
          e.stopPropagation();
          if (currentReaction) {
            setShowInfo(!showInfo); // Nếu đã có reaction thì click để xem thông tin
            setShowMenu(false);
          } else {
            handleMainClick(); // Nếu chưa có thì thả cảm xúc
          }
        }}
      >
        {countReactions !== "" && (
          <span
            style={{
              fontSize: "12px",
              marginRight: "4px",
              fontWeight: "bold",
              color: "#666",
            }}
          >
            {countReactions}
          </span>
        )}
        {currentReactionObj.icon}
      </button>

      {/* BẢNG HIỂN THỊ THÔNG TIN KHI CLICK */}
      {showInfo && currentReaction && (
        <div
          style={{
            position: "absolute",
            bottom: "100%", // Nổi lên trên nút
            marginBottom: "8px",
            right: isMine ? 0 : "auto",
            left: isMine ? "auto" : 0,
            backgroundColor: "#fff",
            boxShadow: "0px 2px 10px rgba(0,0,0,0.15)",
            borderRadius: "8px",
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            border: "1px solid #eaeaea",
            padding: "10px 16px", // Tăng khoảng trống bên trong khung (trên/dưới 10px, trái/phải 16px)
            minWidth: "max-content", // Tự động giãn chiều rộng cho vừa khít với tên dài nhất
            whiteSpace: "nowrap", // Ngăn không cho chữ (tên người dùng) bị ép xuống dòng
            gap: "12px", // Tăng khoảng cách giữa các dòng người dùng với nhau
          }}
        >
          {/* Dùng .map để lặp qua mảng allReactions và in ra từng người */}
          {allReactions &&
            allReactions.map((r, index) => {
              // Tìm thông tin màu sắc/icon tương ứng với cảm xúc của người này
              const userReactionObj = reactions.find(
                (item) => item.type === r.type,
              );

              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    justifyContent: "space-between",
                  }}
                >
                  <span>
                    <img
                      src={
                        r.userId?.avatar ||
                        "https://res.cloudinary.com/dpym64zg9/image/upload/v1755614090/raw_cq4nqn.png"
                      }
                      alt="avatar"
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  </span>

                  {/* Hiển thị tên (Có dấu ? để tránh lỗi nếu API chưa kịp trả về) */}
                  <span style={{ fontSize: "13px", fontWeight: "500" }}>
                    {r.userId?.name || "Đang tải..."}
                  </span>
                  <span
                    style={{
                      color: userReactionObj?.color,
                      fontSize: "16px",
                      display: "flex",
                    }}
                  >
                    {userReactionObj?.icon}
                  </span>
                </div>
              );
            })}
        </div>
      )}

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
