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

export default function MiniChatNode({
  chatData,
  windowIndex,
  bubbleIndex,
  renderType,
}) {
  const dispatch = useDispatch();
  const { parseEmojis } = useEmojiParser();
  const { receiver, conversationId, message, isWindowOpen } = chatData;
  const nodeRef = useRef(null);
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
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const startRight = isWindowOpen ? 70 + (windowIndex + 1) * 350 : 20;
  const startBottom = isWindowOpen ? 20 : 20 + bubbleIndex * 70;

  // 3. Lấy kích thước tương ứng từ MiniChat.module.css[cite: 1]
  const nodeWidth = isWindowOpen ? 330 : 60;
  const nodeHeight = isWindowOpen ? 430 : 60;

  // 4. BỘ GIỚI HẠN TUYỆT ĐỐI CHO BỐN CẠNH
  const dragBounds = {
    right: 90, // Kéo phải tối đa (X dương)
    bottom: startBottom, // Kéo xuống tối đa (Y dương)
    left: -(windowSize.width - nodeWidth - startRight + 300), // Kéo trái tối đa (X âm)
    top: -(windowSize.height - nodeHeight - startBottom - 20), // Kéo lên tối đa (Y âm)
  };

  // 5. Cờ chống click khi kéo thả (Giải quyết Vấn đề 1)
  const [isDragging, setIsDragging] = useState(false);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 }); // Kiểm soát tọa độ để không bị lỗi đè lên nhau

  // Reset tọa độ khi mở/đóng cửa sổ (Giải quyết Vấn đề 3)
  useEffect(() => {
    setDragPos({ x: 0, y: 0 });
  }, [isWindowOpen]);

  const handleDrag = (e, data) => {
    setIsDragging(true);
    setDragPos({ x: data.x, y: data.y });
  };

  const handleStop = () => {
    setTimeout(() => setIsDragging(false), 100);
  };

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
    if (isDragging) {
      return; // Nếu đang kéo thì huỷ bỏ việc mở chat
    }
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
    <Draggable
      nodeRef={nodeRef}
      handle=".drag-handle"
      bounds={dragBounds}
      position={dragPos}
      onDrag={handleDrag}
      onStop={handleStop}
    >
      <div
        ref={nodeRef}
        className={cx("nodeWrapper")}
        style={{
          right: `${startRight}px`,
          bottom: `${startBottom}px`,
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
                receiverId={receiverId}
                conversationIdProp={conversationId}
              />
            </div>
          </div>
        )}
      </div>
    </Draggable>
  );
}
