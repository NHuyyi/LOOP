import { useState } from "react";
import styles from "./MessageList.module.css";
import classNames from "classnames/bind";
import ReactionStatus from "../ReactionStatus/ReactionStatus";
import ReactionPicker from "../ReactionPicker/ReactionPicker";
import { MoreVertical } from "lucide-react";
import MessageMenu from "../MessageMenu/MessageMenu";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className={cx("messageRow", isMyMessage ? "myMsg" : "otherMsg")}>
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
        <div
          style={{
            display: "flex",
            flexDirection: isMyMessage ? "row-reverse" : "row",
            alignItems: "center",
            gap: "8px",
            maxWidth: "100%",
          }}
        >
          <div className={cx("bubble")}>
            {msg.replyTo && (
              <div className={cx("replyQuote")}>
                <span className={cx("replyQuoteName")}>
                  {/* Kiểm tra xem người bị trả lời có phải là người gửi tin nhắn hiện tại không */}

                  {msg.replyTo.senderId?.name}
                </span>
                <p className={cx("replyQuoteText")}>{msg.replyTo.text}</p>
              </div>
            )}
            <span className={cx("msgText")}>{msg.text}</span>

            {isLastInSequence && (
              <span className={cx("msgTimeInside")}>
                {formatTime(msg.createdAt || msg.updatedAt)}
              </span>
            )}

            <div className={cx("status-wrapper")}>
              <ReactionStatus
                allReactions={msg.reactions}
                isMine={isMyMessage}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              position: "relative",
            }}
            className={cx("reactionPickerContainer")}
          >
            <div className={cx("picker-wrapper")}>
              <ReactionPicker
                messageId={msg._id}
                currentReaction={myReaction}
                isMine={isMyMessage}
              />
            </div>
            <button
              className={cx("menuOpenBtn")}
              onClick={(e) => {
                e.stopPropagation(); // Ngăn chặn việc click truyền vào khung tin nhắn gây bật/tắt "Đã xem"
                setIsMenuOpen(!isMenuOpen); // Bật/Tắt trạng thái menu
              }} // Kích hoạt mở MessageMenu
              title="Thêm"
            >
              <MoreVertical size={16} />
            </button>
            {isMenuOpen && (
              <div
                style={{
                  position: "absolute",
                  bottom: "100%", // Đẩy menu xuống dưới nút 3 chấm
                  right: isMyMessage ? "0" : "auto", // Tin nhắn của mình thì menu canh lề phải
                  left: isMyMessage ? "auto" : "0", // Tin nhắn người kia thì menu canh lề trái
                  zIndex: 50,
                }}
              >
                <MessageMenu
                  message={msg}
                  onClose={() => setIsMenuOpen(false)} // Truyền hàm để menu tự đóng khi chọn xong
                />
              </div>
            )}
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
