import styles from "./MessageList.module.css";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function TypingIndicator({ activeReceiver }) {
  return (
    <div className={cx("typingIndicator")}>
      <img
        src={
          activeReceiver?.avatar ||
          "https://res.cloudinary.com/dpym64zg9/image/upload/v1755614090/raw_cq4nqn.png"
        }
        alt="typing-avatar"
        className={cx("msgAvatar")}
      />
      <div className={cx("typingDots")}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}

export default TypingIndicator;
