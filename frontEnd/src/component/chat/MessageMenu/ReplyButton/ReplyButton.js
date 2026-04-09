import { useDispatch } from "react-redux";
import { setReplyMessage } from "../../../../redux/chatSlice";
import { Reply } from "lucide-react";

const ReplyButton = ({ message, closeMenu }) => {
  const dispatch = useDispatch();

  const handleReply = () => {
    dispatch(
      setReplyMessage({
        _id: message._id,
        text: message.text,
        name: message.senderId?.name || "Người dùng", // Lấy tên người gửi
      }),
    );
    closeMenu(); // Đóng menu sau khi click
  };

  return (
    <button onClick={handleReply}>
      <Reply size={16} /> Trả lời
    </button>
  );
};

export default ReplyButton;
