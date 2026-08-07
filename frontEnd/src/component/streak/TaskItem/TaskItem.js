import styles from "./TaskItem.module.css";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function TaskItem({ task, isCompleted, onToggle }) {
  return (
    <div
      id={`task-${task.id}`}
      className={cx("item", { done: isCompleted })}
      onClick={() => onToggle(task.id)}
    >
      <span className={cx("check")}>{isCompleted ? "✅" : "⬜"}</span>
      <span className={cx("taskIcon")}>{task.icon}</span>
      <p className={cx("title")}>{task.title}</p>
      <span className={cx("badge")}>+{task.points} ⭐</span>
    </div>
  );
}

export default TaskItem;
