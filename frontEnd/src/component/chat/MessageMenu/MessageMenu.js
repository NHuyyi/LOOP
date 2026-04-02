import ReplyButton from "./ReplyButton/ReplyButton";
import ForwardButton from "./ForwardButton/ForwardButton";
import DeleteButton from "./DeleteButton/DeleteButton";
import RevokeButton from "./RevokeButton/RevokeButton";

const MessageMenu = ({ message, isOwnMessage, onClose }) => {
  return (
    <div className="message-menu-wrapper">
      <div className="message-menu-dropdown">
        <ReplyButton message={message} closeMenu={onClose} />
        <ForwardButton message={message} closeMenu={onClose} />
        <DeleteButton message={message} closeMenu={onClose} />
        <RevokeButton message={message} closeMenu={onClose} />
        {/* Chỉ hiện nút Thu hồi nếu đây là tin nhắn do chính mình gửi */}
        {isOwnMessage && <RevokeButton message={message} closeMenu={onClose} />}
      </div>
    </div>
  );
};

export default MessageMenu;
