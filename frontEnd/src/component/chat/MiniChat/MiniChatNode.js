// src/component/chat/MiniChat/MiniChatNode.js
import React, { useRef, useEffect, useState } from "react";
import Draggable from "react-draggable";
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

export default function MiniChatNode({ chatData, index }) {
  const dispatch = useDispatch();
  const { parseEmojis } = useEmojiParser();
  const { receiver, conversationId, message, isWindowOpen } = chatData;
  const nodeRef = useRef(null);
  const receiverId = receiver._id;
  const scrollRef = useRef(null);

  const currentUser = useSelector((state) => state.user.user);
  // 1. Check trạng thái Online/Offline
  const onlineUsers = useSelector((state) => state.online);
  const isOnline = onlineUsers.includes(receiverId._id);

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

  useEffect(() => {
    if (
      lastMessage &&
      String(lastMessage.senderId?._id || lastMessage.senderId) ===
        String(receiverId._id) &&
      lastMessage.status !== "read"
    ) {
      setIsUnread(true);
    } else {
      setIsUnread(false);
    }
  }, [lastMessage, receiverId._id]);

  // 4. Logic Preview Last Message 2 giây
  useEffect(() => {
    if (message.length > 0 && !isWindowOpen) {
      const lastMsg = message[message.length - 1];
      // Nếu tin nhắn cuối là của đối phương gửi tới
      if (
        String(lastMsg.senderId?._id || lastMsg.senderId) ===
          String(receiverId._id) &&
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
  }, [message, isWindowOpen, receiverId._id, isUnread]);

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
    <Draggable nodeRef={nodeRef} handle=".drag-handle" bounds="body">
      <div
        ref={nodeRef}
        className={cx("nodeWrapper")}
        style={{
          right: isWindowOpen ? `${20 + (index + 1) * 340}px` : "20px",
          bottom: "20px",
        }}
      >
        {!isWindowOpen ? (
          /* ================= BONG BÓNG CHAT ================= */
          <div
            cclassName={cx("drag-handle", "bubbleContainer")}
            onClick={toggleWindow}
          >
            <div className={cx("avatarWrapper")}>
              <img
                src={
                  receiverId.avatar ||
                  "https://res.cloudinary.com/dpym64zg9/image/upload/v1755614090/raw_cq4nqn.png"
                }
                alt="avatar"
                className={cx("bubbleAvatar", { offline: !isOnline })}
              />
              {isUnread && <span className={cx("unreadDot")}></span>}
            </div>
            <button className={cx("closeBubbleBtn")} onClick={handleClose}>
              <X size={12} />
            </button>
            {previewMsg && (
              <div cclassName={cx("previewTooltip")}>
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
                      receiverId.avatar ||
                      "https://res.cloudinary.com/dpym64zg9/image/upload/v1755614090/raw_cq4nqn.png"
                    }
                    alt={receiverId.name}
                    className={cx("avatar", { offline: !isOnline })}
                  />
                  <span
                    className={cx(
                      "statusDot",
                      isOnline ? "onlineDot" : "offlineDot",
                    )}
                  />
                </div>
                <span className={cx("name")}>{receiverId.name}</span>
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
                      if (nextTimeDiff >= 30 * 60 * 1000)
                        isLastInSequence = true;
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
                receiverId={receiver._id}
                conversationIdProp={conversationId}
              />
            </div>
          </div>
        )}
      </div>
    </Draggable>
  );
}
