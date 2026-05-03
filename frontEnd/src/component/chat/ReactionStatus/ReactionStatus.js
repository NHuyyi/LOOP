// ReactionStatus.js
import React, { useState, useRef, useEffect } from "react";

import { useReactions } from "../../../hooks/useReactions";
import classNames from "classnames/bind";
import styles from "./ReactionStatus.module.css";

const cx = classNames.bind(styles);

function ReactionStatus({ allReactions, isMine }) {
  const [showDetails, setShowDetails] = useState(false);
  const statusRef = useRef(null);
  const { getReactionByType } = useReactions();
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
        {uniqueTypes.slice(0, 3).map((type) => {
          const reactionInfo = getReactionByType(type);
          return reactionInfo ? (
            <span key={type}>
              {/* SỬ DỤNG ẢNH THAY CHO ICON */}
              <img
                src={reactionInfo.icon}
                alt={reactionInfo.type}
                style={{ width: "20px", height: "20px", objectFit: "contain" }}
              />
            </span>
          ) : null;
        })}
        <span className={cx("count")}>{allReactions.length}</span>
      </div>

      {showDetails && (
        <div className={cx("details-popup", isMine ? "pos-right" : "pos-left")}>
          {allReactions.map((r, idx) => {
            const reactionInfo = getReactionByType(r.type);
            return (
              <div key={idx} className={cx("detail-item")}>
                <img src={r.userId?.avatar} alt="avatar" />
                <span>{r.userId?.name}</span>
                <span>
                  {reactionInfo && (
                    <img
                      src={reactionInfo.icon}
                      alt={reactionInfo.type}
                      style={{
                        width: "20px",
                        height: "20px",
                        objectFit: "contain",
                      }}
                    />
                  )}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ReactionStatus;
