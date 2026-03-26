import React, { useState } from "react";
import styles from "./MessageInput.module.css";
import classNames from "classnames/bind";
import { Send, Image, Smile } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";

import { sendMessage } from "../../../services/chat/sendMessage";
import {
  addMessage,
  updateLastMessage,
  markConversationAsRead,
} from "../../../redux/chatSlice";
import { updateChatInFilteredFriends } from "../../../redux/friendSlice";
import { markAsRead } from "../../../services/chat/markAsRead";

const cx = classNames.bind(styles);

function MessageInput() {
  const [text, setText] = useState("");
  const dispatch = useDispatch();

  const stateUser = useSelector((state) => state.user);
  const currentUser = stateUser?.user;

  const {
    ConversationList = [],
    activeConversationId,
    activeReceiver,
    currentMessages,
  } = useSelector((state) => state.chat);

  const handleFocus = async () => {
    // Nếu chưa có cuộc trò chuyện nào hoặc không có tin nhắn thì bỏ qua
    if (
      !activeConversationId ||
      !currentMessages ||
      currentMessages.length === 0
    )
      return;

    // Lấy tin nhắn cuối cùng trong mảng
    const lastMsg = currentMessages[currentMessages.length - 1];
    const senderId = lastMsg.senderId?._id || lastMsg.senderId;

    // KẾT HỢP ĐIỀU KIỆN:
    // - Người gửi tin nhắn cuối KHÔNG phải là mình
    // - Trạng thái của tin nhắn chưa phải là "read"
    if (
      String(senderId) !== String(currentUser?._id) &&
      lastMsg.status !== "read"
    ) {
      try {
        // GỌI API BÁO ĐÃ XEM LÊN SERVER
        await markAsRead(activeConversationId);
        dispatch(
          markConversationAsRead({
            conversationId: activeConversationId,
          }),
        );
      } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái đã xem:", error);
      }
    }
  };
  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    let receiverId = null;

    if (activeConversationId) {
      const currentConv = ConversationList.find(
        (c) => c._id === activeConversationId,
      );
      const receiver = currentConv?.participants.find(
        (p) => p._id !== currentUser?._id,
      );
      receiverId = receiver?._id;
    } else if (activeReceiver) {
      receiverId = activeReceiver._id;
    }

    if (!receiverId) return; // Không có người nhận thì không gửi

    try {
      const res = await sendMessage(receiverId, text);
      if (res?.success) {
        const newMessage = res.message;

        // ném vào redux để hiển thị lên màng hình ngay lập tức
        dispatch(
          addMessage({
            conversationId: activeConversationId,
            message: newMessage,
          }),
        );

        // ném vào danh sách cột 1 để cập nhật lại tinh nhắn cuối và đẩy lên top 1
        dispatch(
          updateLastMessage({
            conversationId: activeConversationId,
            message: newMessage,
          }),
        );

        // cập nhật cột 3 ở trang home
        dispatch(
          updateChatInFilteredFriends({
            friendId: receiverId,
            conversationId: activeConversationId,
          }),
        );

        setText("");
      }
    } catch (err) {
      console.log("Lỗi khi gửi tin:", err);
    }
  };

  return (
    <form className={cx("inputArea")} onSubmit={handleSend}>
      <button type="button" className={cx("actionBtn")}>
        <Image size={22} />
      </button>
      <button type="button" className={cx("actionBtn")}>
        <Smile size={22} />
      </button>

      <input
        type="text"
        placeholder="Nhập tin nhắn"
        className={cx("textInput")}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onFocus={handleFocus}
      />
      <button type="submit" className={cx("sendBtn")} disabled={!text.trim()}>
        <Send size={22} />
      </button>
    </form>
  );
}

export default MessageInput;
