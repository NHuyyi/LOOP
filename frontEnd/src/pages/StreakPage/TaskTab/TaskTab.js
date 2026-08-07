import { useState } from "react";
import styles from "./TaskTab.module.css";
import classNames from "classnames/bind";
import TaskItem from "../../../component/streak/TaskItem/TaskItem";
import TaskProgress from "../../../component/streak/TaskProgress/TaskProgress";

const cx = classNames.bind(styles);

function TaskTab({ dailyTasks = [], weeklyTasks = [] }) {
  const [filter, setFilter] = useState("daily");

  const currentTasks    = filter === "daily" ? dailyTasks : weeklyTasks;
  const completedCount  = currentTasks.filter((t) => t.completed).length;

  return (
    <section className={cx("section")}>
      <div className={cx("sectionHeader")}>
        <h2 className={cx("title")}>🎯 Nhiệm vụ</h2>
        <div className={cx("filter")}>
          <button
            id="filter-daily"
            className={cx("filterBtn", { active: filter === "daily" })}
            onClick={() => setFilter("daily")}
          >
            📅 Hàng ngày
          </button>
          <button
            id="filter-weekly"
            className={cx("filterBtn", { active: filter === "weekly" })}
            onClick={() => setFilter("weekly")}
          >
            📆 Hàng tuần
          </button>
        </div>
      </div>

      <p className={cx("desc")}>Hoàn thành nhiệm vụ để tích điểm và leo bảng xếp hạng</p>

      <TaskProgress completed={completedCount} total={currentTasks.length} />

      <div className={cx("list")}>
        {currentTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            isCompleted={task.completed}
            // Remove onToggle because tasks are auto-completed by backend
            onToggle={() => {}}
          />
        ))}
      </div>
    </section>
  );
}

export default TaskTab;
