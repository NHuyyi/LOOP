import React, { useEffect, useState } from "react";
import styles from "./MessageInput.module.css";
import classNames from "classnames/bind";
import { Send, Smile, X, Ban } from "lucide-react"; // Import thêm icon X
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
import EmojiStickerPicker from "./EmojiStickerPicker";
import { useRichTextEditor } from "../../../hooks/useRichTextEditor";
const cx = classNames.bind(styles);
let typingTimeout = null;

function MessageInput({ receiverId }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const dispatch = useDispatch();
  const stateUser = useSelector((state) => state.user);
  const currentUser = stateUser?.user;

  const { activeConversationId, currentMessages, replyMessage } = useSelector(
    (state) => state.chat,
  );

  const handleFocus = async () => {
    if (
      !activeConversationId ||
      !currentMessages ||
      currentMessages.length === 0
    )
      return;
    const lastMsg = currentMessages[currentMessages.length - 1];
    const senderId = lastMsg.senderId?._id || lastMsg.senderId;
    if (
      String(senderId) !== String(currentUser?._id) &&
      lastMsg.status !== "read"
    ) {
      try {
        await markAsRead(activeConversationId);
        dispatch(
          markConversationAsRead({ conversationId: activeConversationId }),
        );
      } catch (error) {
        console.error("Lỗi cập nhật trạng thái:", error);
      }
    }
  };

  const blockStatus = useSelector((state) => state.chat.blockStatus) || {};
  const { isBlockedByMe, isBlockedByThem } = blockStatus;
  const isChatDisabled = isBlockedByMe || isBlockedByThem;

  let placeholderText = "Nhập tin nhắn...";
  if (isBlockedByMe) {
    placeholderText = "Bạn đã chặn đối phương.";
  } else if (isBlockedByThem) {
    placeholderText = "Bạn đã bị chặn bởi đối phương.";
  }

  const handleSend = async (e) => {
    e.preventDefault();
    if (isChatDisabled) return; // Không cho gửi khi bị block

    const textToSend = getParsedText();
    if ((!textToSend.trim() && !selectedImage) || !receiverId) return;

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
        text: textToSend,
        replyTo: replyMessage ? replyMessage._id : null,
        imageUrl: uploadedImageUrl,
        messageType: uploadedImageUrl ? "image" : "text",
      };

      const res = await sendMessage(payload);
      if (res?.success) {
        const newMessage = res.message;
        dispatch(
          addMessage({
            conversationId: activeConversationId,
            message: newMessage,
          }),
        );
        dispatch(
          updateLastMessage({
            conversationId: activeConversationId,
            message: newMessage,
          }),
        );
        dispatch(
          updateChatInFilteredFriends({
            friendId: receiverId,
            conversationId: activeConversationId,
          }),
        );

        clearEditor();
        setSelectedImage(null);
        setImagePreview(null);
        setShowPicker(false);
        if (typingTimeout) clearTimeout(typingTimeout);
        socket.emit("stopTyping", {
          senderId: currentUser._id,
          receiverId,
          conversationId: activeConversationId,
        });
        if (replyMessage) dispatch(clearReplyMessage());
      }
    } catch (err) {
      console.log("Lỗi khi gửi tin:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const { editorRef, insertTextAtcursor, getParsedText, clearEditor } =
    useRichTextEditor();

  const handleTyping = () => {
    if (!receiverId || !activeConversationId) return;
    socket.emit("typing", {
      senderId: currentUser._id,
      receiverId,
      conversationId: activeConversationId,
    });
    if (typingTimeout) clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socket.emit("stopTyping", {
        senderId: currentUser._id,
        receiverId,
        conversationId: activeConversationId,
      });
    }, 2500);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  useEffect(() => {
    clearEditor(); // Quét sạch chữ/icon trong ô nhập
    setSelectedImage(null); // Xóa ảnh đang chọn (nếu có)
    setImagePreview(null);
    if (replyMessage) {
      dispatch(clearReplyMessage()); // Xóa luôn trạng thái "Đang trả lời"
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConversationId]);

  const handleInputEvent = (e) => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      // Trình duyệt thường để lại <br> hoặc <div><br></div> khi xóa hết text
      if (
        html === "<br>" ||
        html === "<div><br></div>" ||
        html === "<br><br>"
      ) {
        editorRef.current.innerHTML = ""; // Xóa trắng tuyệt đối để CSS :empty hoạt động
      }
    }
    // Sau khi dọn rác xong, vẫn gọi hàm handleTyping cũ của bạn để báo đang gõ
    handleTyping();
  };
  return (
    <div
      className={cx("messageInputContainer")}
      style={{ width: "100%", display: "flex", flexDirection: "column" }}
    >
      {replyMessage && (
        <div className={cx("reply-preview-box")}>
          <div className={cx("reply-info")}>
            <span className={cx("reply-name")}>
              Đang trả lời {replyMessage.name}
            </span>
            <p className={cx("reply-text")}>{replyMessage.text}</p>
          </div>
          <button
            className={cx("close-reply-btn")}
            onClick={() => dispatch(clearReplyMessage())}
          >
            X
          </button>
        </div>
      )}

      <form className={cx("inputArea")} onSubmit={handleSend}>
        <ImageUpload
          isUploading={isUploading}
          onImageSelect={(file, preview) => {
            setSelectedImage(file);
            setImagePreview(preview);

            if (editorRef.current) {
              editorRef.current.focus();
              const selection = window.getSelection();
              const range = document.createRange();
              range.selectNodeContents(editorRef.current);
              range.collapse(false);
              selection.removeAllRanges();
              selection.addRange(range);
            }
          }}
        />

        <div
          className={cx("sticker-action-wrapper")}
          style={{ position: "relative" }}
        >
          <button
            type="button"
            className={cx("actionBtn")}
            onClick={() => setShowPicker(!showPicker)}
          >
            <Smile size={22} />
          </button>

          {/* GỌI BẢNG TỐI GIẢN RA */}
          {showPicker && (
            <EmojiStickerPicker
              onSelectMyIcon={(icon) => insertTextAtcursor(icon, handleTyping)}
              onClose={() => setShowPicker(false)}
            />
          )}
        </div>

        {!isChatDisabled && (
          <div
            className={cx("sticker-action-wrapper")}
            style={{ position: "relative" }}
          >
            <button
              type="button"
              className={cx("actionBtn")}
              onClick={() => setShowPicker(!showPicker)}
            >
              <Smile size={22} />
            </button>
            {showPicker && (
              <EmojiStickerPicker
                onSelectMyIcon={(icon) =>
                  insertTextAtcursor(icon, handleTyping)
                }
                onClose={() => setShowPicker(false)}
              />
            )}
          </div>
        )}

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

          <div
            className={cx("textInput", "editableInput")}
            contentEditable={!isUploading && !isChatDisabled} // Khóa ô nhập
            ref={editorRef}
            onInput={handleInputEvent}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            data-placeholder={placeholderText} // Text động theo trạng thái block
            style={{
              cursor: isChatDisabled ? "not-allowed" : "text",
              color: isChatDisabled ? "#999" : "inherit",
            }}
          ></div>
        </div>

        <button
          type="submit"
          className={cx("sendBtn")}
          disabled={isUploading || isChatDisabled}
        >
          {isChatDisabled ? (
            <Ban size={22} color="#bcc0c4" />
          ) : (
            <Send size={22} />
          )}
        </button>
      </form>
    </div>
  );
}

export default MessageInput;
