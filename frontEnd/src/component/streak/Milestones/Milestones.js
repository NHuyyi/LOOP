import styles from "./Milestones.module.css";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function Milestones({ milestones, currentStreak }) {
  return (
    <div className={cx("wrap")}>
      <p className={cx("title")}>🏆 Cột mốc</p>
      <div className={cx("list")}>
        {milestones.map((days) => {
          const done = currentStreak >= days;
          return (
            <div key={days} className={cx("item", { done })}>
              <span className={cx("icon")}>{done ? "✅" : "🔒"}</span>
              <span>{days} ngày</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Milestones;
