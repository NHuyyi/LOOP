import React, { useEffect, useRef, useState } from "react";
import styles from "./MessageList.module.css";
import classNames from "classnames/bind";
import { useSelector, useDispatch } from "react-redux";
import { getMessages } from "../../../services/chat/getMessages";
import { loadMoreMessages } from "../../../redux/chatSlice";
import MessageReaction from "../MessageReaction/MessageReaction";

const cx = classNames.bind(styles);

function MessageList() {
  const dispatch = useDispatch();
  const scrollRef = useRef();

  const stateUser = useSelector((state) => state.user);
  const currentUser = stateUser?.user;

  const {
    currentMessages,
    activeConversationId,
    page,
    hasMore,
    activeReceiver,
  } = useSelector((state) => state.chat);

  const [loading, setLoading] = useState(false);

  // luôn cuộn xuống cùng khi có tin nhắn mới (page == 1)
  useEffect(() => {
    if (scrollRef.current && page === 1) {
      scrollRef.current.crollTop = scrollRef.current.scrollHeight;
    }
  }, [currentMessages, page]);

  // xử lý Infinite Scroll (tải trang khi cuộn lên top)
  const handleScroll = async (e) => {
    if (e.target.scrollTop === 0 && hasMore && !loading) {
      setLoading(true);
      const previousHeight = e.target.scrollHeight;

      const res = await getMessages(activeConversationId, page + 1);

      if (res?.success) {
        dispatch(loadMoreMessages(res.data));

        // Giữ nguyên vị trí thanh cuộn sau khi nối mảng
        requestAnimationFrame(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTop =
              scrollRef.current.scrollHeight - previousHeight;
          }
        });
        setLoading(false);
      }
    }
  };
  // 1. Chỉ dùng state để lưu ID tin nhắn mà người dùng CHỦ ĐỘNG CLICK (mặc định chưa click gì thì là null)
  const [clickedMsgId, setClickedMsgId] = useState(null);

  const [localReactions, setLocalReactions] = useState({});

  const handleReactionChange = (msgId, reactionType) => {
    setLocalReactions((prev) => ({
      ...prev,
      [msgId]: reactionType,
    }));
  };

  // 2. Tự động tính toán ID của tin nhắn mặc định (Tin cuối cùng của mảng)
  const lastMessage = currentMessages[currentMessages.length - 1];
  const isLastMessageMine =
    lastMessage &&
    (lastMessage.senderId?._id || lastMessage.senderId) === currentUser?._id;

  // Nếu tin cuối là của mình thì id mặc định là nó, ngược lại là null
  const defaultStatusId = isLastMessageMine ? lastMessage._id : null;

  // 3. Quyết định sẽ hiện trạng thái ở ID nào:
  // Ưu tiên cái người dùng đang click. Nếu họ không click gì (clickedMsgId là null), thì hiện cái mặc định.
  const activeStatusId = clickedMsgId !== null ? clickedMsgId : defaultStatusId;

  // 4. Hàm xử lý khi click vào tin nhắn
  const handleMsgClick = (msgId) => {
    // Nếu click lại vào chính tin nhắn đang được ưu tiên hiển thị -> Xóa click đi (set về null)
    // Khi set về null, biến activeStatusId sẽ tự động quay về hiển thị defaultStatusId (tin nhắn cuối cùng)
    setClickedMsgId((prevId) => (prevId === msgId ? null : msgId));
  };

  // Hàm chuyển đổi thời gian sang định dạng Giờ:Phút (VD: 10:45)
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    // Tùy chọn 'vi-VN' sẽ tự động format giờ theo kiểu Việt Nam
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Hàm chuyển đổi thời gian cho dải phân cách ở nền (Chi tiết hơn: Giờ:Phút Ngày/Tháng/Năm)
  const formatSeparatorTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className={cx("messageList")} ref={scrollRef} onScroll={handleScroll}>
      {loading && <div className={cx("spinner-border")} />}

      {currentMessages.map((msg, index) => {
        // kiểm tra người gửi là ai
        const isMyMessage =
          (msg.senderId?._id || msg.senderId) === currentUser?._id;

        // Điều kiện hiển thị trạng thái
        const showStatus = activeStatusId === msg._id;

        // logic tính thời gian
        const prevMsg = currentMessages[index - 1];
        const nextMsg = currentMessages[index + 1];

        const currentSenderId = msg.senderId?._id;
        const nextSenderId = nextMsg?.senderId?._id;

        // kiểm tra xem có cần hiện dải thời gian ở nền không (cách 30p)
        let showTimeSeparator = false;
        if (index === 0) {
          showTimeSeparator = true; // luôn hiện thời gian cho tin nhắn đầu tiên của mảng
        } else if (prevMsg) {
          const timeDiff =
            new Date(msg.createdAt) - new Date(prevMsg.createdAt);
          if (timeDiff >= 30 * 60 * 1000) {
            showTimeSeparator = true;
          }
        }

        // kiểm tra xem đây có phải tin nhắn cuối trong chuỗi tin nhắn không
        let isLastInSequence = false;
        if (!nextMsg) {
          isLastInSequence = true;
        } else {
          if (nextSenderId !== currentSenderId) {
            isLastInSequence = true;
          } else {
            const nextTimeDiff =
              new Date(nextMsg.createdAt) - new Date(msg.createdAt);
            if (nextTimeDiff >= 30 * 60 * 1000) {
              isLastInSequence = true;
            }
          }
        }

        const myReaction = msg.reactions?.find(
          (r) => (r.userId?._id || r.userId) === currentUser?._id,
        )?.type;

        const finalReaction =
          localReactions[msg._id] !== undefined
            ? localReactions[msg._id]
            : myReaction;
        return (
          // Dùng React.Fragment vì bây giờ mỗi vòng lặp có thể trả về 2 phần tử (Dải phân cách + Tin nhắn)
          <React.Fragment key={msg._id || index}>
            {/* 1. HIỂN THỊ DẢI THỜI GIAN Ở NỀN (NẾU CÁCH NHAU 30 PHÚT) */}
            {showTimeSeparator && (
              <div className={cx("timeSeparator")}>
                {formatSeparatorTime(msg.createdAt || msg.updatedAt)}
              </div>
            )}

            {/* 2. HIỂN THỊ TIN NHẮN */}
            <div className={cx(isMyMessage ? "myMsg" : "otherMsg")}>
              {!isMyMessage && (
                <img
                  src={
                    msg.senderId?.avatar ||
                    "https://res.cloudinary.com/dpym64zg9/image/upload/v1755614090/raw_cq4nqn.png"
                  }
                  alt="avatar"
                  className={cx("msgAvatar")}
                  // Ẩn avatar đi nếu chưa phải tin cuối của chuỗi, giữ lại không gian để các bong bóng thẳng hàng
                  style={{
                    visibility: isLastInSequence ? "visible" : "hidden",
                  }}
                />
              )}

              <div
                className={cx("messageContent")}
                onClick={() => isMyMessage && handleMsgClick(msg._id)}
                style={{
                  position: "relative", // Quan trọng: Để đặt các nút reaction tuyệt đối theo bong bóng
                  cursor: isMyMessage ? "pointer" : "default",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: isMyMessage ? "flex-end" : "flex-start",
                  // Tạo khoảng cách dưới nếu tin nhắn này có reaction để không bị lẹm
                  marginBottom:
                    msg.reactions && msg.reactions.length > 0 ? "16px" : "4px",
                }}
              >
                <div className={cx("bubble")}>
                  <span className={cx("msgText")}>{msg.text}</span>

                  {/* CHỈ HIỆN THỜI GIAN TRONG BONG BÓNG NẾU LÀ TIN CUỐI CÙNG CỦA CHUỖI */}
                  {isLastInSequence && (
                    <span className={cx("msgTimeInside")}>
                      {formatTime(msg.createdAt || msg.updatedAt)}
                    </span>
                  )}
                  {/* --- NÚT THÊM CẢM XÚC ĐÈ GÓC --- */}
                  <div
                    className={cx(
                      "reactActionArea",
                      isMyMessage ? "actionLeft" : "actionRight",
                      { alwaysShow: finalReaction },
                    )}
                  >
                    <MessageReaction
                      messageId={msg._id}
                      initialReaction={myReaction}
                      allReactions={msg.reactions || []}
                      isMine={isMyMessage}
                      onReactionChange={(type) =>
                        handleReactionChange(msg._id, type)
                      }
                    />
                  </div>
                </div>

                {isMyMessage && showStatus && (
                  <div className={cx("messageStatus")}>
                    {msg.status === "sent" && (
                      <img
                        title="Đã gửi"
                        src="https://res.cloudinary.com/dpym64zg9/image/upload/v1755614090/raw_cq4nqn.png"
                        alt="sent"
                        className={cx("avatarStatus", "sent")}
                      />
                    )}
                    {msg.status === "delivered" && (
                      <img
                        title="Đã nhận"
                        src={
                          activeReceiver?.avatar ||
                          "https://res.cloudinary.com/dpym64zg9/image/upload/v1755614090/raw_cq4nqn.png"
                        }
                        alt="delivered"
                        className={cx("avatarStatus", "delivered")}
                      />
                    )}
                    {msg.status === "read" && (
                      <img
                        title="Đã xem"
                        src={
                          activeReceiver?.avatar ||
                          "https://res.cloudinary.com/dpym64zg9/image/upload/v1755614090/raw_cq4nqn.png"
                        }
                        alt="read"
                        className={cx("avatarStatus", "read")}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default MessageList;
