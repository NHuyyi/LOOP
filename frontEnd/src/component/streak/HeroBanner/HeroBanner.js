import styles from "./HeroBanner.module.css";
import classNames from "classnames/bind";
import StatCard from "../StatCard/StatCard";

const cx = classNames.bind(styles);

function HeroBanner({ user, streak, totalPoints, todayPoints, rank }) {
  return (
    <div className={cx("hero")}>
      <div className={cx("glow")} />

      <div className={cx("profile")}>
        <div className={cx("avatar-wrap")}>
          <img
            src={user?.avatar || "https://i.pravatar.cc/150?img=1"}
            alt="avatar"
            className={cx("avatar")}
          />
          <span className={cx("flame")}>🔥</span>
        </div>
        <div className={cx("info")}>
          <h1 className={cx("name")}>{user?.name || "Bạn"}</h1>
          <p className={cx("sub")}>Hành trình streak của bạn</p>
        </div>
      </div>

      <div className={cx("stats")}>
        <StatCard icon="🔥" value={streak}                     label="Ngày liên tiếp" variant="fire"   />
        <StatCard icon="⭐" value={totalPoints.toLocaleString()} label="Tổng điểm"      variant="points" />
        <StatCard icon="✅" value={todayPoints}                 label="Điểm hôm nay"   variant="today"  />
        <StatCard icon="🏅" value={`#${rank}`}                  label="Xếp hạng"       variant="rank"   />
      </div>
    </div>
  );
}

export default HeroBanner;
