import styles from "./ChatStreak.module.css";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

/**
 * ChatStreak — hiển thị chuỗi nhắn tin ngày liên tiếp giữa 2 người.
 * Tương tự TikTok DM streak badge.
 *
 * Props:
 *  - streak: number   — số ngày liên tiếp
 *  - size: "sm" | "md" (default "md")
 *  - showLabel: boolean (default true) — hiện text "ngày liên tiếp"
 */
function ChatStreak({ streak = 0, size = "md", showLabel = true }) {
  if (!streak || streak < 1) return null;

  const isHot  = streak >= 30;
  const isWarm = streak >= 7;

  return (
    <div className={cx("wrap", size, { hot: isHot, warm: isWarm })}>
      <span className={cx("flame")}>🔥</span>
      <span className={cx("count")}>{streak}</span>
    </div>
  );
}

export default ChatStreak;
