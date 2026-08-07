import { useState, useEffect } from "react";
import styles from "./StreakPage.module.css";
import classNames from "classnames/bind";
import { useSelector } from "react-redux";
import StatCard from "../../component/streak/StatCard/StatCard";
import TaskTab from "./TaskTab/TaskTab";
import LeaderboardSection from "./LeaderboardSection/LeaderboardSection";
import { getMyStats } from "../../services/streak/streakServices";

const cx = classNames.bind(styles);

function StreakPage() {
  const stateUser = useSelector((state) => state.user);
  const currentUser = stateUser?.user;

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

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
            icon="🏅"
            value={`#${stats?.rank || "--"}`}
            label="Xếp hạng"
            variant="rank"
          />
        </div>

        {/* ── Bảng nhiệm vụ ── */}
        <TaskTab
          dailyTasks={stats?.dailyTasks || []}
          weeklyTasks={stats?.weeklyTasks || []}
        />

        {/* ── Bảng xếp hạng ── */}
        <LeaderboardSection />

      </div>
    </div>
  );
}

export default StreakPage;
