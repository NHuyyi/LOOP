import React from "react";
import { useDispatch } from "react-redux";
import { revokeMessage } from "../../../../services/chat/revokeMessage"; // Đường dẫn tuỳ thuộc vào cấu trúc thư mục của bạn
import { revokeMessageInState } from "../../../../redux/chatSlice";

const RevokeButton = ({ message, closeMenu }) => {
  const dispatch = useDispatch();

  const handleRevoke = async () => {
    // Gọi API thu hồi
    const response = await revokeMessage(message._id);

    if (response.success) {
      // Dispatch lên Redux để cập nhật giao diện người gửi ngay lập tức
      dispatch(
        revokeMessageInState({
          messageId: message._id,
          conversationId: message.conversationId,
        }),
      );
    } else {
      alert(response.message || "Không thể thu hồi tin nhắn lúc này");
    }

    // Đóng menu
    closeMenu();
  };

  return (
    <button onClick={handleRevoke} className="menu-action-btn revoke-btn">
      Thu hồi
    </button>
  );
};

export default RevokeButton;
