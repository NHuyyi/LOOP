import React, { useState } from "react";
import styles from "./MessageInput.module.css";
import classNames from "classnames/bind";
import { Send, Image, Smile } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import socket from "../../../socker";

import { sendMessage } from "../../../services/chat/sendMessage";
import {
  addMessage,
  updateLastMessage,
  markConversationAsRead,
  clearReplyMessage,
} from "../../../redux/chatSlice";
import { updateChatInFilteredFriends } from "../../../redux/friendSlice";
import { markAsRead } from "../../../services/chat/markAsRead";

const cx = classNames.bind(styles);
let typingTimeout = null;
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
    replyMessage,
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

  // HÀM LẤY ID NGƯỜI NHẬN
  const getReceiverId = () => {
    if (activeConversationId) {
      const currentConv = ConversationList.find(
        (c) => c._id === activeConversationId,
      );
      const receiver = currentConv?.participants.find(
        (p) => p._id !== currentUser?._id,
      );
      return receiver?._id;
    } else if (activeReceiver) {
      return activeReceiver._id;
    }
    return null;
  };

  // CẬP NHẬT LẠI HÀM onChange CỦA INPUT
  const handleTyping = (e) => {
    setText(e.target.value);

    const receiverId = getReceiverId();
    if (!receiverId || !activeConversationId) return;

    // Phát sự kiện đang gõ
    socket.emit("typing", {
      senderId: currentUser._id,
      receiverId,
      conversationId: activeConversationId,
    });

    // Reset lại đồng hồ đếm ngược mỗi khi gõ phím
    if (typingTimeout) clearTimeout(typingTimeout);

    // Nếu sau 2.5 giây không gõ nữa thì tắt trạng thái typing
    typingTimeout = setTimeout(() => {
      socket.emit("stopTyping", {
        senderId: currentUser._id,
        receiverId,
        conversationId: activeConversationId,
      });
    }, 2500);
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
      const payload = {
        receiverId: receiverId,
        text: text,
        replyTo: replyMessage ? replyMessage._id : null,
      };
      const res = await sendMessage(payload);
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
        if (typingTimeout) clearTimeout(typingTimeout);
        socket.emit("stopTyping", {
          senderId: currentUser._id,
          receiverId: receiverId, // receiverId đã lấy trong handleSend cũ của bạn
          conversationId: activeConversationId,
        });

        if (replyMessage) {
          dispatch(clearReplyMessage());
        }
      }
    } catch (err) {
      console.log("Lỗi khi gửi tin:", err);
    }
  };

  return (
    // THÊM THẺ DIV NÀY ĐỂ BỌC TOÀN BỘ LẠI
    <div
      className={cx("messageInputContainer")}
      style={{ width: "100%", display: "flex", flexDirection: "column" }}
    >
      {/* Khung preview trả lời */}
      {replyMessage && (
        <div className="reply-preview-box">
          <div className="reply-info">
            <span className="reply-name">
              Đang trả lời {replyMessage.senderName}
            </span>
            <p className="reply-text">{replyMessage.text}</p>
          </div>
          <button
            className="close-reply-btn"
            onClick={() => dispatch(clearReplyMessage())} // ĐÃ SỬA CHỮ 'R' VIẾT HOA
          >
            ❌
          </button>
        </div>
      )}

      {/* Form nhập liệu */}
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
          onChange={handleTyping}
          onFocus={handleFocus}
        />
        <button type="submit" className={cx("sendBtn")} disabled={!text.trim()}>
          <Send size={22} />
        </button>
      </form>
    </div>
  );
}

export default MessageInput;
