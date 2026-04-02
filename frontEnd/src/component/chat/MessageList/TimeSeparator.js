import styles from "./MessageList.module.css";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function TimeSeparator({ timeString }) {
  return <div className={cx("timeSeparator")}>{timeString}</div>;
}

export default TimeSeparator;
