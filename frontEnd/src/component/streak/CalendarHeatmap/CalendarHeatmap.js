import styles from "./CalendarHeatmap.module.css";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const TOTAL_DAYS = 28;

function getLevel(dayIndex, streak) {
  if (dayIndex >= streak) return "empty";
  if (dayIndex % 3 === 0) return "high";
  if (dayIndex % 2 === 0) return "med";
  return "low";
}

function CalendarHeatmap({ streak }) {
  return (
    <div className={cx("wrap")}>
      <p className={cx("title")}>Hoạt động 4 tuần gần nhất</p>
      <div className={cx("grid")}>
        {Array.from({ length: TOTAL_DAYS }, (_, i) => (
          <div
            key={i}
            className={cx("cell", getLevel(i, streak))}
            title={`${TOTAL_DAYS - i} ngày trước`}
          />
        ))}
      </div>
      <div className={cx("legend")}>
        <span>Ít</span>
        <div className={cx("cell", "empty", "sm")} />
        <div className={cx("cell", "low",   "sm")} />
        <div className={cx("cell", "med",   "sm")} />
        <div className={cx("cell", "high",  "sm")} />
        <span>Nhiều</span>
      </div>
    </div>
  );
}

export default CalendarHeatmap;
