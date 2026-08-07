import styles from "./LeaderboardRow.module.css";
import classNames from "classnames/bind";
import RankMedal from "../RankMedal/RankMedal";

const cx = classNames.bind(styles);

function LeaderboardRow({ entry, rank, renderRight, renderSub }) {
  return (
    <div className={cx("row", { top: rank <= 3 })}>
      <div className={cx("rank")}>
        <RankMedal rank={rank} />
      </div>
      <img src={entry.avatar} alt={entry.name} className={cx("avatar")} />
      <div className={cx("info")}>
        <p className={cx("name")}>{entry.name}</p>
        <p className={cx("sub")}>{renderSub(entry)}</p>
      </div>
      <div className={cx("right")}>{renderRight(entry)}</div>
    </div>
  );
}

export default LeaderboardRow;
