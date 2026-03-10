import { useEffect, useRef, useState } from "react";
import styles from "./MessageList.module.css";
import classNames from "classnames/bind";
import { useSelector, useDispatch } from "react-redux";
import { getMessages } from "../../../services/chat/getMessages";
import { loadMoreMessages } from "../../../redux/chatSlice";

const cx = classNames.bind(styles);

function MessageList() {
  const dispatch = useDispatch();
  const scrollRef = useRef();

  const stateUser = useSelector((state) => state.user);
  const currentUser = stateUser?.user;

  const { currentMessages, activeConversationId, page, hasMore } = useSelector(
    (state) => state.chat,
  );
  console.log(
    "currentMessages",
    useSelector((state) => state.chat),
  );

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

  return (
    <div className={cx("messageList")} ref={scrollRef} onScroll={handleScroll}>
      {loading && <div className={cx("spinner-border")} />}

      {currentMessages.map((msg, index) => {
        // kiểm tra người gửi là ai
        const isMyMessage = msg.senderId._id === currentUser?._id;

        return (
          <div
            key={msg._id || index}
            className={cx(isMyMessage ? "myMsg" : "otherMsg")}
          >
            {!isMyMessage && (
              <img
                src={
                  msg.senderId?.avatar ||
                  "https://res.cloudinary.com/dpym64zg9/image/upload/v1755614090/raw_cq4nqn.png"
                }
                alt="avatar"
                className={cx("msgAvatar")}
              />
            )}
            <div className={cx("bubble")}>{msg.text}</div>
          </div>
        );
      })}
    </div>
  );
}

export default MessageList;
