import styles from "./MessageList.module.css";
import classNames from "classnames/bind";
import ReactionStatus from "../ReactionStatus/ReactionStatus";
import ReactionPicker from "../ReactionPicker/ReactionPicker";

const cx = classNames.bind(styles);

function MessageItem({
  msg,
  isMyMessage,
  isLastInSequence,
  showStatus,
  myReaction,
  formatTime,
  handleMsgClick,
  activeReceiver,
}) {
  return (
    <div className={cx(isMyMessage ? "myMsg" : "otherMsg")}>
      {!isMyMessage && (
        <img
          src={
            msg.senderId?.avatar ||
            "https://res.cloudinary.com/dpym64zg9/image/upload/v1755614090/raw_cq4nqn.png"
          }
          alt="avatar"
          className={cx("msgAvatar")}
          style={{ visibility: isLastInSequence ? "visible" : "hidden" }}
        />
      )}

      <div
        className={cx("messageContent")}
        onClick={() => isMyMessage && handleMsgClick(msg._id)}
        style={{
          position: "relative",
          cursor: isMyMessage ? "pointer" : "default",
          display: "flex",
          flexDirection: "column",
          alignItems: isMyMessage ? "flex-end" : "flex-start",
          marginBottom:
            msg.reactions && msg.reactions.length > 0 ? "16px" : "4px",
        }}
      >
        <div className={cx("bubble")}>
          <span className={cx("msgText")}>{msg.text}</span>

          {isLastInSequence && (
            <span className={cx("msgTimeInside")}>
              {formatTime(msg.createdAt || msg.updatedAt)}
            </span>
          )}

          <div className={cx("status-wrapper")}>
            <ReactionStatus allReactions={msg.reactions} isMine={isMyMessage} />
          </div>

          <div className={cx("picker-wrapper")}>
            <ReactionPicker
              messageId={msg._id}
              currentReaction={myReaction}
              isMine={isMyMessage}
            />
          </div>
        </div>

        {isMyMessage && showStatus && (
          <div className={cx("messageStatus")}>
            {msg.status === "sent" && (
              <img
                title="Đã gửi"
                src="https://res.cloudinary.com/dpym64zg9/image/upload/v1755614090/raw_cq4nqn.png"
                alt="sent"
                className={cx("avatarStatus", "sent")}
              />
            )}
            {msg.status === "delivered" && (
              <img
                title="Đã nhận"
                src={
                  activeReceiver?.avatar ||
                  "https://res.cloudinary.com/dpym64zg9/image/upload/v1755614090/raw_cq4nqn.png"
                }
                alt="delivered"
                className={cx("avatarStatus", "delivered")}
              />
            )}
            {msg.status === "read" && (
              <img
                title="Đã xem"
                src={
                  activeReceiver?.avatar ||
                  "https://res.cloudinary.com/dpym64zg9/image/upload/v1755614090/raw_cq4nqn.png"
                }
                alt="read"
                className={cx("avatarStatus", "read")}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageItem;
