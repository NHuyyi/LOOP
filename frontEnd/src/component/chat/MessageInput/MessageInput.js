import React, { useState } from "react";
import styles from "./MessageInput.module.css";
import classNames from "classnames/bind";
import { Send, Smile, X } from "lucide-react"; // Import thêm icon X
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

// IMPORT COMPONENT VÀ SERVICE
import ImageUpload from "./ImageUpload";
import uploadImage from "../../../services/Post/uploadImage";

const cx = classNames.bind(styles);
let typingTimeout = null;

function MessageInput() {
  const [text, setText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

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
    if (!activeConversationId || !currentMessages || currentMessages.length === 0) return;
    const lastMsg = currentMessages[currentMessages.length - 1];
    const senderId = lastMsg.senderId?._id || lastMsg.senderId;
    if (String(senderId) !== String(currentUser?._id) && lastMsg.status !== "read") {
      try {
        await markAsRead(activeConversationId);
        dispatch(markConversationAsRead({ conversationId: activeConversationId }));
      } catch (error) { console.error("Lỗi cập nhật trạng thái:", error); }
    }
  };

  const getReceiverId = () => {
    if (activeConversationId) {
      const currentConv = ConversationList.find(c => c._id === activeConversationId);
      const receiver = currentConv?.participants.find(p => p._id !== currentUser?._id);
      return receiver?._id;
    } else if (activeReceiver) { return activeReceiver._id; }
    return null;
  };

  const handleTyping = (e) => {
    setText(e.target.value);
    const receiverId = getReceiverId();
    if (!receiverId || !activeConversationId) return;
    socket.emit("typing", { senderId: currentUser._id, receiverId, conversationId: activeConversationId });
    if (typingTimeout) clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socket.emit("stopTyping", { senderId: currentUser._id, receiverId, conversationId: activeConversationId });
    }, 2500);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() && !selectedImage) return;

    let receiverId = getReceiverId();
    if (!receiverId) return;

    setIsUploading(true);
    try {
      let uploadedImageUrl = null;

      if (selectedImage) {
        const imageRes = await uploadImage(selectedImage, "LOOP_CHAT");
        if (imageRes.data?.url) {
          uploadedImageUrl = imageRes.data.url;
        } else {
          alert("Tải ảnh thất bại!");
          setIsUploading(false);
          return;
        }
      }
      

      const payload = {
        receiverId,
        text: text,
        replyTo: replyMessage ? replyMessage._id : null,
        imageUrl: uploadedImageUrl,
        messageType: uploadedImageUrl ? "image" : "text",
      };

      const res = await sendMessage(payload);
      if (res?.success) {
        const newMessage = res.message;
        dispatch(addMessage({ conversationId: activeConversationId, message: newMessage }));
        dispatch(updateLastMessage({ conversationId: activeConversationId, message: newMessage }));
        dispatch(updateChatInFilteredFriends({ friendId: receiverId, conversationId: activeConversationId }));

        setText("");
        setSelectedImage(null);
        setImagePreview(null);
        if (typingTimeout) clearTimeout(typingTimeout);
        socket.emit("stopTyping", { senderId: currentUser._id, receiverId, conversationId: activeConversationId });
        if (replyMessage) dispatch(clearReplyMessage());
      }
    } catch (err) {
      console.log("Lỗi khi gửi tin:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={cx("messageInputContainer")} style={{ width: "100%", display: "flex", flexDirection: "column" }}>
      {replyMessage && (
        <div className={cx("reply-preview-box")}>
          <div className={cx("reply-info")}>
            <span className={cx("reply-name")}>Đang trả lời {replyMessage.name}</span>
            <p className={cx("reply-text")}>{replyMessage.text}</p>
          </div>
          <button className={cx("close-reply-btn")} onClick={() => dispatch(clearReplyMessage())}>X</button>
        </div>
      )}

      <form className={cx("inputArea")} onSubmit={handleSend}>
        <ImageUpload 
          isUploading={isUploading}
          onImageSelect={(file, preview) => {
            setSelectedImage(file);
            setImagePreview(preview);
          }}
        />

        <button type="button" className={cx("actionBtn")}>
          <Smile size={22} />
        </button>

        {/* --- CHÍNH LÀ CHỖ NÀY: BỌC CẢ PREVIEW VÀ TEXT VÀO CHUNG 1 Ô --- */}
        <div className={cx("inputWrapper")}>
          {imagePreview && (
            <div className={cx("image-preview-container")}>
              <img 
                src={imagePreview} 
                alt="Preview" 
                className={cx("image-preview-item")}
              />
              <button
                type="button"
                className={cx("remove-image-btn")}
                onClick={() => {
                  setSelectedImage(null);
                  setImagePreview(null);
                }}
              >
                <X size={14} />
              </button>
              {isUploading && <div className={cx("upload-overlay")}>...</div>}
            </div>
          )}

          <input
            type="text"
            placeholder="Nhập tin nhắn"
            className={cx("textInput")}
            value={text}
            onChange={handleTyping}
            onFocus={handleFocus}
            disabled={isUploading}
          />
        </div>

        <button type="submit" className={cx("sendBtn")} disabled={(!text.trim() && !selectedImage) || isUploading}>
          <Send size={22} />
        </button>
      </form>
    </div>
  );
}

export default MessageInput;