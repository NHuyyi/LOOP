// ReactionStatus.js
import React, { useState, useRef, useEffect } from "react";
import {
  FaThumbsUp,
  FaHeart,
  FaLaugh,
  FaSurprise,
  FaSadTear,
  FaAngry,
} from "react-icons/fa";
import classNames from "classnames/bind";
import styles from "./ReactionStatus.module.css";

const cx = classNames.bind(styles);
const reactionIcons = {
  like: { icon: <FaThumbsUp />, color: "#1877F2" },
  love: { icon: <FaHeart />, color: "#F02849" },
  haha: { icon: <FaLaugh />, color: "#FFD93D" },
  wow: { icon: <FaSurprise />, color: "#2ECC71" },
  sad: { icon: <FaSadTear />, color: "#1C8EFB" },
  angry: { icon: <FaAngry />, color: "#E9710F" },
};

function ReactionStatus({ allReactions, isMine }) {
  const [showDetails, setShowDetails] = useState(false);
  const statusRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      // Nếu popup đang mở VÀ click chuột không nằm trong statusRef thì mới đóng
      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setShowDetails(false);
      }
    }

    // CHỈ bật lắng nghe sự kiện khi khung chi tiết đang hiển thị
    if (showDetails) {
      // Dùng mousedown để độ nhạy cao hơn và tránh kẹt event click của React
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDetails]);

  if (!allReactions || allReactions.length === 0) return null;

  // Lấy ra danh sách các loại icon duy nhất để hiển thị tóm tắt
  const uniqueTypes = [...new Set(allReactions.map((r) => r.type))];

  return (
    <div className={cx("status-container")} ref={statusRef}>
      <div
        className={cx("summary-bubble")}
        onClick={(e) => {
          e.stopPropagation(); // Ngăn sự kiện click truyền ngược ra ngoài gây lỗi
          setShowDetails((prev) => !prev); // Cập nhật state an toàn hơn
        }}
      >
        {uniqueTypes.slice(0, 3).map((type) => (
          <span key={type} style={{ color: reactionIcons[type].color }}>
            {reactionIcons[type].icon}
          </span>
        ))}
        <span className={cx("count")}>{allReactions.length}</span>
      </div>

      {showDetails && (
        <div className={cx("details-popup", isMine ? "pos-right" : "pos-left")}>
          {allReactions.map((r, idx) => (
            <div key={idx} className={cx("detail-item")}>
              <img src={r.userId?.avatar} alt="avatar" />
              <span>{r.userId?.name}</span>
              <span style={{ color: reactionIcons[r.type]?.color }}>
                {reactionIcons[r.type]?.icon}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReactionStatus;
