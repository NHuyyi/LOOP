import styles from "./Podium.module.css";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

// order: [1st, 2nd, 3rd] in data — rendered as [2nd, 1st, 3rd] visually
const POSITIONS = [
  { dataIndex: 1, slot: "second", barClass: "bar2", medal: "🥈" },
  { dataIndex: 0, slot: "first",  barClass: "bar1", medal: "🥇" },
  { dataIndex: 2, slot: "third",  barClass: "bar3", medal: "🥉" },
];

function Podium({ entries, valueLabel }) {
  return (
    <div className={cx("podium")}>
      {POSITIONS.map(({ dataIndex, slot, barClass, medal }) => {
        const entry = entries[dataIndex];
        if (!entry) return null;
        const shortName = entry.name.split(" ").pop();

        return (
          <div key={entry.id} className={cx("item", slot)}>
            {slot === "first" && <div className={cx("crown")}>👑</div>}
            <img
              src={entry.avatar}
              alt={entry.name}
              className={cx("avatar", { avatarFirst: slot === "first" })}
            />
            <span className={cx("medal")}>{medal}</span>
            <p className={cx("name")}>{shortName}</p>
            <p className={cx("value")}>{valueLabel(entry)}</p>
            <div className={cx("bar", barClass)} />
          </div>
        );
      })}
    </div>
  );
}

export default Podium;
