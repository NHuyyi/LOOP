import React, { useState } from "react";
import styles from "./MessageInput.module.css";
import classNames from "classnames/bind";
import { Send, Image, Smile } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";

import { sendMessage } from "../../../services/chat/sendMessage";
import { addMessage, updateLastMessage } from "../../../redux/chatSlice";
import { updateChatInFilteredFriends } from "../../../redux/friendSlice";

const cx = classNames.bind(styles);

function MessageInput() {
  const [text, setText] = useState("");
  const dispatch = useDispatch();

  const stateUser = useSelector((state) => state.user);
  const currentUser = stateUser?.user;

  const {
    conversationList = [],
    activeConversationId,
    activeReceiver,
  } = useSelector((state) => state.chat);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    let receiverId = null;

    if (activeConversationId) {
      const currentConv = conversationList.find(
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
        const newMessage = res.data;

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
      />
      <button type="submit" className={cx("sendBtn")} disabled={!text.trim()}>
        <Send size={22} />
      </button>
    </form>
  );
}

export default MessageInput;
