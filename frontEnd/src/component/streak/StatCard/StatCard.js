import styles from "./StatCard.module.css";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function StatCard({ icon, value, label, variant }) {
  return (
    <div className={cx("card", variant)}>
      <span className={cx("icon")}>{icon}</span>
      <span className={cx("value")}>{value}</span>
      <span className={cx("label")}>{label}</span>
    </div>
  );
}

export default StatCard;
