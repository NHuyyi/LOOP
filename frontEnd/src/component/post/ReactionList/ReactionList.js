import { useState } from "react";
import classNames from "classnames/bind";
import styles from "./ReactionList.module.css";
import { useReactions } from "../../../hooks/useReactions";
const cx = classNames.bind(styles);

function ReactionList({ reactions, onClose }) {
  const [activeTab, setActiveTab] = useState("all");

  const { getReactionByType } = useReactions();
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
          {Object.keys(grouped).map((type) => {
            const rInfo = getReactionByType(type);
            return (
              <button
                key={type}
                className={cx("tab", { active: activeTab === type })}
                onClick={() => setActiveTab(type)}
              >
                {rInfo && (
                  <img
                    src={rInfo.icon}
                    alt={type}
                    style={{
                      width: "25px",
                      height: "25px",
                      objectFit: "contain",
                      marginRight: "4px",
                    }}
                  />
                )}
                ({grouped[type].length})
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div className={cx("body")}>
          {displayReactions.length === 0 ? (
            <p>Không có reaction</p>
          ) : (
            displayReactions.map((r) => {
              const rInfo = getReactionByType(r.type);
              return (
                <div key={r.userId} className={cx("item")}>
                  <img
                    src={r.avatar || "https://placehold.co/40x40"}
                    alt={r.name}
                    className={cx("avatar")}
                  />
                  <span className={cx("name")}>{r.name}</span>
                  <span className={cx("emoji")}>
                    <img
                      src={rInfo.icon}
                      alt={r.type}
                      style={{
                        width: "25px",
                        height: "25px",
                        objectFit: "contain",
                      }}
                    />
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default ReactionList;
