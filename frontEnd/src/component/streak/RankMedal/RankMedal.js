import styles from "./RankMedal.module.css";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function RankMedal({ rank }) {
  if (rank === 1) return <span className={cx("medal")}>🥇</span>;
  if (rank === 2) return <span className={cx("medal")}>🥈</span>;
  if (rank === 3) return <span className={cx("medal")}>🥉</span>;
  return <span className={cx("number")}>#{rank}</span>;
}

export default RankMedal;
