import { useState } from "react";
import classNames from "classnames/bind";
import styles from "./ReactionList.module.css";
import {
  FaThumbsUp,
  FaHeart,
  FaLaugh,
  FaSurprise,
  FaSadTear,
  FaAngry,
} from "react-icons/fa";
const cx = classNames.bind(styles);

// Map type -> emoji
const reactionIcons = {
  like: <FaThumbsUp color="#1877F2" size={16} />,
  love: <FaHeart color="#F02849" size={16} />,
  haha: <FaLaugh color="#FFD93D" size={16} />,
  wow: <FaSurprise color="#2ECC71" size={16} />,
  sad: <FaSadTear color="#1C8EFB" size={16} />,
  angry: <FaAngry color="#E9710F" size={16} />,
};

function ReactionList({ reactions, onClose }) {
  const [activeTab, setActiveTab] = useState("all");

  // Gom nhóm reaction theo type
  const grouped = reactions.reduce((acc, r) => {
    if (!acc[r.type]) acc[r.type] = [];
    acc[r.type].push(r);
    return acc;
  }, {});

  // Lấy danh sách hiển thị theo tab
  const displayReactions =
    activeTab === "all" ? reactions : grouped[activeTab] || [];

  return (
    <div className={cx("overlay")} onClick={onClose}>
      <div
        className={cx("popup")}
        onClick={(e) => e.stopPropagation()} // chặn event
      >
        <div className={cx("header")}>
          <h3>Danh sách reaction</h3>
          <button onClick={onClose} className={cx("closeBtn")}>
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className={cx("tabs")}>
          <button
            className={cx("tab", { active: activeTab === "all" })}
            onClick={() => setActiveTab("all")}
          >
            Tất cả ({reactions.length})
          </button>
          {Object.keys(grouped).map((type) => (
            <button
              key={type}
              className={cx("tab", { active: activeTab === type })}
              onClick={() => setActiveTab(type)}
            >
              {reactionIcons[type]} ({grouped[type].length})
            </button>
          ))}
        </div>

        {/* Body */}
        <div className={cx("body")}>
          {displayReactions.length === 0 ? (
            <p>Không có reaction</p>
          ) : (
            displayReactions.map((r) => (
              <div key={r.userId} className={cx("item")}>
                <img
                  src={r.avatar || "https://placehold.co/40x40"}
                  alt={r.name}
                  className={cx("avatar")}
                />
                <span className={cx("name")}>{r.name}</span>
                <span className={cx("emoji")}>{reactionIcons[r.type]}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ReactionList;
