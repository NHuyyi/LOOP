import styles from "./FlameBar.module.css";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const MAX_STREAK = 50;

function FlameBar({ streak }) {
  const percent = Math.min((streak / MAX_STREAK) * 100, 100);

  return (
    <div className={cx("wrap")}>
      <div className={cx("bar")}>
        <div className={cx("fill")} style={{ width: `${percent}%` }} />
      </div>
      <span className={cx("count")}>{streak} 🔥</span>
    </div>
  );
}

export default FlameBar;
