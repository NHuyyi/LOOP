import styles from "./TaskProgress.module.css";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function TaskProgress({ completed, total }) {
  const percent = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className={cx("wrap")}>
      <div className={cx("header")}>
        <span>Tiến độ hôm nay</span>
        <span>{completed}/{total} nhiệm vụ</span>
      </div>
      <div className={cx("bar")}>
        <div className={cx("fill")} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export default TaskProgress;
