// src/component/chat/MiniChat/MiniChatNode.js
import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CloseMiniChat,
  ToggleMiniChatWindow,
  setMiniChatMessages,
  markConversationAsRead,
} from "../../../redux/chatSlice";
import { getMessages } from "../../../services/chat/getMessages";
import { X, Minus } from "lucide-react";
import MessageInput from "../MessageInput/MessageInput";
import { useEmojiParser } from "../../../hooks/useEmojiParser";
import styles from "./MiniChat.module.css";
import MessageItem from "../MessageList/MessageItem";
import TimeSeparator from "../MessageList/TimeSeparator";
import { markAsRead } from "../../../services/chat/markAsRead";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

export default function MiniChatNode({ chatData, windowIndex, bubbleIndex }) {
  const dispatch = useDispatch();
  const { parseEmojis } = useEmojiParser();
  const { receiver, conversationId, message, isWindowOpen } = chatData;

  const receiverId = receiver._id;
  const scrollRef = useRef(null);

  const currentUser = useSelector((state) => state.user.user);
  // 1. Check trạng thái Online/Offline
  const onlineUsers = useSelector((state) => state.online);
  const isOnline = onlineUsers.includes(receiverId);

  const [previewMsg, setPreviewMsg] = useState("");
  const [clickedMsgId, setClickedMsgId] = useState(null);

  // 2. Fetch tin nhắn khi khởi tạo
  useEffect(() => {
    const fetchMiniChatMessages = async () => {
      if (conversationId && message.length === 0) {
        try {
          const res = await getMessages(conversationId, 1);
          if (res?.success) {
            dispatch(
              setMiniChatMessages({
                receiverId: receiverId,
                messages: res.messages,
                conversationId: conversationId,
              }),
            );
          }
        } catch (error) {
          console.error("Lỗi khi tải tin nhắn mini chat:", error);
        }
      }
    };
    fetchMiniChatMessages();
  }, [conversationId, receiverId, message.length, dispatch]);

  // 3. Logic Dot Unread (Chấm xanh)
  const lastMessage = message[message.length - 1];
  const isLastMessageMine =
    lastMessage &&
    String(lastMessage.senderId?._id || lastMessage.senderId) ===
      String(currentUser?._id);
  const defaultStatusId = isLastMessageMine ? lastMessage._id : null;
  const activeStatusId = clickedMsgId !== null ? clickedMsgId : defaultStatusId;
  const [isUnread, setIsUnread] = useState(true);

  const startRight = isWindowOpen ? 70 + (windowIndex + 1) * 350 : 20;
  // Lưu ý: Đã đổi 350 thành 340 (độ rộng 330px + 10px khoảng cách) để các cửa sổ khít hơn
  const startBottom = isWindowOpen ? 20 : 20 + bubbleIndex * 70;

  useEffect(() => {
    if (
      lastMessage &&
      String(lastMessage.senderId?._id || lastMessage.senderId) ===
        String(receiverId) &&
      lastMessage.status !== "read"
    ) {
      setIsUnread(true);
    } else {
      setIsUnread(false);
    }
  }, [lastMessage, receiverId]);

  // 4. Logic Preview Last Message 2 giây
  useEffect(() => {
    if (message.length > 0 && !isWindowOpen) {
      const lastMsg = message[message.length - 1];
      // Nếu tin nhắn cuối là của đối phương gửi tới
      if (
        String(lastMsg.senderId?._id || lastMsg.senderId) ===
          String(receiverId) &&
        isUnread === true
      ) {
        setPreviewMsg(lastMsg.text);
        const timer = setTimeout(() => {
          setPreviewMsg("");
        }, 2000); // 2 giây sau sẽ biến mất
        return () => clearTimeout(timer);
      } else {
        // Nếu đã đọc rồi thì xóa preview đi (phòng trường hợp đang hiện mà bị đọc)
        setPreviewMsg("");
      }
    }
  }, [message, isWindowOpen, receiverId, isUnread]);

  useEffect(() => {
    if (isWindowOpen && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [message, isWindowOpen]);

  const handleMsgClick = (msgId) => {
    setClickedMsgId((prevId) => (prevId === msgId ? null : msgId));
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatSeparatorTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleClose = (e) => {
    e.stopPropagation();
    dispatch(CloseMiniChat({ receiverId }));
  };

  const toggleWindow = async (e) => {
    e.stopPropagation();

    dispatch(
      ToggleMiniChatWindow({
        receiverId: receiverId,
        isOpen: !isWindowOpen,
      }),
    );

    await markAsRead(conversationId);
    dispatch(
      markConversationAsRead({
        conversationId: conversationId,
        currentUserId: currentUser._id,
      }),
    );

    setIsUnread(false);
  };

  return (
    <div
      className={cx("nodeWrapper")}
      style={{
        position: "fixed",
        right: `${startRight}px`,
        bottom: `${startBottom}px`,
        transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
      }}
    >
      {!isWindowOpen ? (
        /* ================= BONG BÓNG CHAT ================= */
        <div
          className={cx("drag-handle", "bubbleContainer")}
          onClick={toggleWindow}
        >
          <div className={cx("avatarWrapper")}>
            <img
              src={
                receiver.avatar ||
                "https://res.cloudinary.com/dpym64zg9/image/upload/v1755614090/raw_cq4nqn.png"
              }
              alt="avatar"
              className={cx("bubbleAvatar", { offline: !isOnline })}
              draggable={false}
            />
            {isUnread && <span className={cx("unreadDot")}></span>}
          </div>
          <button className={cx("closeBubbleBtn")} onClick={handleClose}>
            <X size={12} />
          </button>
          {previewMsg && (
            <div className={cx("previewTooltip")}>
              {parseEmojis(previewMsg, false)}
            </div>
          )}
        </div>
      ) : (
        /* ================= CỬA SỔ CHAT ================= */
        <div className={cx("miniChatWindow")}>
          <div className={cx("drag-handle", "header")}>
            <div
              className={cx("userInfo")}
              onClick={toggleWindow}
              style={{ cursor: "pointer" }}
            >
              <div className={cx("avatarWrapper")}>
                <img
                  src={
                    receiver.avatar ||
                    "https://res.cloudinary.com/dpym64zg9/image/upload/v1755614090/raw_cq4nqn.png"
                  }
                  alt={receiver.name}
                  className={cx("avatar", { offline: !isOnline })}
                />
                <span
                  className={cx(
                    "statusDot",
                    isOnline ? "onlineDot" : "offlineDot",
                  )}
                />
              </div>
              <span className={cx("name")}>{receiver.name}</span>
            </div>
            <div className={cx("headerActions")}>
              <button
                className={cx("iconBtn")}
                onClick={toggleWindow}
                title="Thu nhỏ"
              >
                <Minus size={18} />
              </button>
              <button
                className={cx("iconBtn")}
                onClick={handleClose}
                title="Đóng"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* MESSAGE LIST - REUSE MESSAGE ITEM */}
          <div className={cx("messageList")} ref={scrollRef}>
            {message && message.length > 0 ? (
              message.map((msg, idx) => {
                const isMyMessage =
                  String(msg.senderId?._id || msg.senderId) ===
                  String(currentUser?._id);
                const myReaction = msg.reactions?.find(
                  (r) =>
                    String(r.userId?._id || r.userId) ===
                    String(currentUser?._id),
                )?.type;
                const showStatus = activeStatusId === msg._id;

                const prevMsg = message[idx - 1];
                const nextMsg = message[idx + 1];
                const currentSenderId = String(
                  msg.senderId?._id || msg.senderId,
                );
                const nextSenderId = nextMsg
                  ? String(nextMsg.senderId?._id || nextMsg.senderId)
                  : null;

                let showTimeSeparator = false;
                if (idx === 0) {
                  showTimeSeparator = true;
                } else if (prevMsg) {
                  const timeDiff =
                    new Date(msg.createdAt) - new Date(prevMsg.createdAt);
                  if (timeDiff >= 30 * 60 * 1000) showTimeSeparator = true;
                }

                let isLastInSequence = false;
                if (!nextMsg) {
                  isLastInSequence = true;
                } else {
                  if (nextSenderId !== currentSenderId) {
                    isLastInSequence = true;
                  } else {
                    const nextTimeDiff =
                      new Date(nextMsg.createdAt) - new Date(msg.createdAt);
                    if (nextTimeDiff >= 30 * 60 * 1000) isLastInSequence = true;
                  }
                }

                return (
                  <React.Fragment key={msg._id || idx}>
                    {showTimeSeparator && (
                      <TimeSeparator
                        timeString={formatSeparatorTime(
                          msg.createdAt || msg.updatedAt,
                        )}
                      />
                    )}
                    <MessageItem
                      msg={msg}
                      isMyMessage={isMyMessage}
                      isLastInSequence={isLastInSequence}
                      showStatus={showStatus}
                      myReaction={myReaction}
                      formatTime={formatTime}
                      handleMsgClick={handleMsgClick}
                      activeReceiver={receiver}
                      isTopMessage={idx <= 1}
                      isMiniChat={true}
                    />
                  </React.Fragment>
                );
              })
            ) : (
              <p
                className={cx("emptyText")}
                style={{ textAlign: "center", color: "gray" }}
              >
                Chưa có tin nhắn nào
              </p>
            )}
          </div>

          <div className={cx("inputArea")}>
            <MessageInput
              receiverId={receiverId}
              conversationIdProp={conversationId}
            />
          </div>
        </div>
      )}
    </div>
  );
}
