import styles from "./PointsSummary.module.css";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function PointsSummary({ todayPoints, totalPoints }) {
  return (
    <div className={cx("wrap")}>
      <div className={cx("row")}>
        <span>Điểm hôm nay</span>
        <span className={cx("today")}>{todayPoints} ⭐</span>
      </div>
      <div className={cx("row")}>
        <span>Tổng điểm</span>
        <span className={cx("total")}>{(totalPoints + todayPoints).toLocaleString()} ⭐</span>
      </div>
    </div>
  );
}

export default PointsSummary;
