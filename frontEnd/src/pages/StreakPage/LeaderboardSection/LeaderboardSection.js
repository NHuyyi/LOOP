import { useState, useEffect } from "react";
import styles from "./LeaderboardSection.module.css";
import classNames from "classnames/bind";
import FlameBar from "../../../component/streak/FlameBar/FlameBar";
import RankMedal from "../../../component/streak/RankMedal/RankMedal";
import { getPointsLeaderboard, getFriendStreakLeaderboard } from "../../../services/streak/streakServices";

const cx = classNames.bind(styles);

function LeaderboardSection() {
  const [tab, setTab] = useState("points"); // "points" | "streak"
  const [pointsData, setPointsData] = useState([]);
  const [friendsData, setFriendsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboards = async () => {
      setLoading(true);
      const [pointsRes, friendsRes] = await Promise.all([
        getPointsLeaderboard(),
        getFriendStreakLeaderboard()
      ]);
      
      if (pointsRes.success) {
        setPointsData(pointsRes.data);
      }
      if (friendsRes.success) {
        setFriendsData(friendsRes.data);
      }
      setLoading(false);
    };

    fetchLeaderboards();
  }, []);

  const data      = tab === "points" ? pointsData : friendsData;
  const isPoints  = tab === "points";

  const timeAgo = (dateStr) => {
    if (!dateStr) return "Chưa nhắn tin";
    const diff = new Date() - new Date(dateStr);
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return `${seconds} giây trước`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} ngày trước`;
    return new Date(dateStr).toLocaleDateString();
  };

  const renderTop3 = () => {
    if (data.length === 0) return null;
    
    // Ensure we have up to 3 items
    const top3Data = [data[0], data[1], data[2]].filter(Boolean);
    const order = [1, 0, 2]; // Index mapping for visual podium (2nd, 1st, 3rd)
    
    return (
      <div className={cx("top3")}>
        {order.map((posIdx) => {
          const entry = top3Data[posIdx];
          if (!entry) return <div key={`empty-${posIdx}`} className={cx("podiumItem", "empty")} />;
          
          const rank  = posIdx === 1 ? 1 : posIdx === 0 ? 2 : 3;
          const slots = ["second", "first", "third"];
          
          return (
            <div key={entry.userId} className={cx("podiumItem", slots[posIdx])}>
              {posIdx === 1 && <span className={cx("crown")}>👑</span>}
              <img src={entry.avatar} alt={entry.name} className={cx("podiumAvatar", { big: posIdx === 1 })} />
              <p className={cx("podiumName")}>{entry.name.split(" ").pop()}</p>
              <p className={cx("podiumVal")}>
                {isPoints ? `${entry.points.toLocaleString()} ⭐` : `${entry.streak} 🔥`}
              </p>
              <div className={cx("podiumBar", `bar${rank}`)} />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section className={cx("section")}>
      {/* Header + tabs */}
      <div className={cx("header")}>
        <h2 className={cx("title")}>🏆 Bảng xếp hạng</h2>
        <div className={cx("tabs")}>
          <button
            id="lb-tab-points"
            className={cx("tab", { active: isPoints })}
            onClick={() => setTab("points")}
          >
            ⭐ Điểm số
          </button>
          <button
            id="lb-tab-streak"
            className={cx("tab", { active: !isPoints })}
            onClick={() => setTab("streak")}
          >
            🔥 Chuỗi bạn bè
          </button>
        </div>
      </div>

      <p className={cx("desc")}>
        {isPoints
          ? "Top 50 người dùng có điểm nhiệm vụ cao nhất"
          : "Top 50 bạn bè có chuỗi nhắn tin dài nhất"}
      </p>

      {loading ? (
        <p className={cx("loading")}>Đang tải...</p>
      ) : (
        <>
          {/* Top 3 highlight */}
          {renderTop3()}

          {/* Full list — scroll container */}
          <div className={cx("listWrap")}>
            <div className={cx("list")}>
              {data.map((entry, idx) => (
                <div key={entry.userId} className={cx("row", { top: idx < 3 })}>
                  {/* rank */}
                  <div className={cx("rank")}>
                    <RankMedal rank={entry.rank} />
                  </div>

                  {/* avatar */}
                  <img src={entry.avatar} alt={entry.name} className={cx("avatar")} />

                  {/* info */}
                  <div className={cx("info")}>
                    <p className={cx("name")}>{entry.name}</p>
                    <p className={cx("sub")}>
                      {isPoints
                        ? `${entry.points.toLocaleString()} Điểm tổng`
                        : timeAgo(entry.lastMessageDate)}
                    </p>
                  </div>

                  {/* right */}
                  <div className={cx("right")}>
                    {isPoints ? (
                      <span className={cx("badge")}>{entry.points.toLocaleString()} ⭐</span>
                    ) : (
                      <div className={cx("streakRight")}>
                        <FlameBar streak={entry.streak} />
                        {/* We might not have isOnline yet without socket integration here, so skipping it for now or add if available */}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default LeaderboardSection;
