import { useState, useEffect } from "react";
import styles from "./StreakPage.module.css";
import classNames from "classnames/bind";
import StatCard from "../../component/streak/StatCard/StatCard";
import TaskTab from "./TaskTab/TaskTab";
import LeaderboardSection from "./LeaderboardSection/LeaderboardSection";
import ShopTab from "./ShopTab/ShopTab";
import { getMyStats } from "../../services/streak/streakServices";

const cx = classNames.bind(styles);

function StreakPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const [activeTab, setActiveTab] = useState("task");

  useEffect(() => {
    const fetchStats = async () => {
      const result = await getMyStats();
      if (result.success) {
        setStats(result.data);
      } else {
        setErrorMsg(result.message || "Không thể lấy dữ liệu");
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className={cx("page")}><div className={cx("inner")}>Đang tải dữ liệu...</div></div>;
  }

  if (errorMsg) {
    return (
      <div className={cx("page")}>
        <div className={cx("inner")}>
          <h2 style={{ color: "red", textAlign: "center", marginTop: "50px" }}>Lỗi: {errorMsg}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={cx("page")}>
      <div className={cx("inner")}>

        {/* ── 3 Stat Cards ── */}
        <div className={cx("statsRow")}>
          <StatCard
            icon="✅"
            value={stats?.todayPoints || 0}
            label="Điểm hôm nay"
            variant="today"
          />
          <StatCard
            icon="⭐"
            value={(stats?.totalPoints || 0).toLocaleString()}
            label="Tổng điểm"
            variant="points"
          />

          <StatCard
            icon="🪙"
            value={stats?.coins?.toLocaleString() || 0}
            label="Ngân khố"
            variant="coins"
          />

          <StatCard
            icon="🏅"
            value={`#${stats?.rank || "--"}`}
            label="Xếp hạng"
            variant="rank"
          />


        </div>

        {/* ── Bảng nhiệm vụ ── */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
          <button
            onClick={() => setActiveTab('task')}
            style={{ padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', background: activeTab === 'task' ? '#8a64ff' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none' }}>
            Nhiệm vụ
          </button>
          <button
            onClick={() => setActiveTab('shop')}
            style={{ padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', background: activeTab === 'shop' ? '#8a64ff' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none' }}>
            Cửa hàng
          </button>
        </div>

        {/* --- HIỂN THỊ NỘI DUNG THEO TAB --- */}
        {activeTab === "task" && (
          <TaskTab
            dailyTasks={stats?.dailyTasks || []}
            weeklyTasks={stats?.weeklyTasks || []}
          />
        )}

        {activeTab === "shop" && (
          <ShopTab />
        )}

        {/* ── Bảng xếp hạng ── */}
        <LeaderboardSection />

      </div>
    </div>
  );
}

export default StreakPage;
