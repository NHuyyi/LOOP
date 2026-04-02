import { useDispatch } from "react-redux";
import { setReplyingMessage } from "../../redux/chatSlice";

const ReplyButton = ({ message, closeMenu }) => {
  const dispatch = useDispatch();

  const handleReply = () => {
    dispatch(
      setReplyingMessage({
        _id: message._id,
        text: message.text,
        senderName: message.senderId?.name || "Người dùng", // Lấy tên người gửi
      }),
    );
    closeMenu(); // Đóng menu sau khi click
  };

  return (
    <button onClick={handleReply} className="menu-action-btn">
      ↪️ Trả lời
    </button>
  );
};

export default ReplyButton;
