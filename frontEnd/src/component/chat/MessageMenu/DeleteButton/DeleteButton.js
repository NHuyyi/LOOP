import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setInitialMessages } from "../../../../redux/chatSlice";

// Import service xóa tin nhắn của bạn
import { deleteMessage } from "../../../../services/chat/deleteMessage";
// Import service lấy danh sách tin nhắn của bạn (giả định tên là getMessages)
import { getMessages } from "../../../../services/chat/getMessages";

const DeleteButton = ({ message, closeMenu }) => {
  const dispatch = useDispatch();

  // This state is used to find the info of the person we are chatting
  const activeReceiver = useSelector((state) => state.chat.activeReceiver);

  console.log("DeleteButton received message:", message.conversationId);
  const handleDelete = async () => {
    try {
      // first, we call the deleteMessage service to delete the message
      const deleteResult = await deleteMessage(message._id);

      // This code checks if the delete unsucceeded and shows an alert if it did, then closes the menu and returns early
      if (deleteResult.success === false) {
        alert(deleteResult.message);
        closeMenu();
        return;
      }

      console.log("Đã xóa tin nhắn thành công:", message._id);

      // second, we call the getMessages service to get the updated list of messages for the conversation
      const resMessages = await getMessages(message.conversationId,1);

      // This code checks if the getMessages call was successful and updates the Redux store with the new list of messages.
      if (resMessages) {
        dispatch(
          setInitialMessages({
            conversationId: message.conversationId,
            messages: resMessages.messages,
            receiver: activeReceiver,
          }),
        );
      }

      // 4. close the menu after the operations are done
      closeMenu();
    } catch (error) {
      console.error("Lỗi giao diện khi xóa tin nhắn:", error);
      alert("Không thể tải lại tin nhắn lúc này.");
    }
  };

  return (
    <button onClick={handleDelete} className="menu-action-btn delete-btn">
      Xóa
    </button>
  );
};

export default DeleteButton;
