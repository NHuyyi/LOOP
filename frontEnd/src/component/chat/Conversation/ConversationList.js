import React, { useEffect, useState } from "react";
import styles from "./ConversationList.module.css";
import classNames from "classnames/bind";
import { Search } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";

import { getConversations } from "../../../services/chat/getConversations";
import { getMessages } from "../../../services/chat/getMessages";
import { setConversations, setInitialMessages } from "../../../redux/chatSlice";

const cx = classNames.bind(styles);

const ConversationList = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const stateUser = useSelector((state) => state.user);
  const currentUser = stateUser?.user;
  const { ConversationList, activeConversationId } = useSelector(
    (state) => state.chat,
  );

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      const res = await getConversations(currentUser?._id);
      console.log("Fetched conversations:", res.data);
      if (res?.success) {
        dispatch(setConversations(res.data));
      }
      setLoading(false);
    };
    if (currentUser && ConversationList.length === 0) {
      fetchConversations();
    }
  }, [currentUser, dispatch]);

  // xử lý khi click vào 1 người để mở khung chat
  const handleConversationClick = async (conversation) => {
    if (activeConversationId === conversation._id) return; // nếu đã click vào rồi thì không làm gì

    try {
      const res = await getMessages(conversation._id, 1);
      if (res?.success) {
        dispatch(
          setInitialMessages({
            conversationId: conversation._id,
            messages: res.data,
          }),
        );
      }
    } catch (error) {
      console.error("Lỗi lấy tin nhắn:", error);
    }
  };

  return (
    <div className={cx("container")}>
      <div className={cx("search-bar")}>
        <div className={cx("search-input-wrapper")}>
          <Search className={cx("search-icon")} size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm "
            className={cx("search-input")}
          />
        </div>
      </div>
      <div className={cx("list")}>
        {loading && <div className={cx("spinner-border")} />}

        {conversationList.map((conv) => {
          // tìm người bạn chat cùng
          const otherUser = conv.participants.find(
            (p) => p._id !== currentUser._id,
          );

          const isActive = conv._id === activeConversationId;

          return (
            <div
              key={conv._id}
              className={cx("item", { active: isActive })}
              onClick={() => handleConversationClick(conv)}
            >
              <img
                src={
                  otherUser.avatar ||
                  "https://res.cloudinary.com/dpym64zg9/image/upload/v1755614090/raw_cq4nqn.png"
                }
                alt="avatar"
                className={cx("avatar")}
              />
              <div className={cx("info")}>
                <div className={cx("name-time")}>
                  <h4>{otherUser.name}</h4>
                  <span>
                    {conv.lastMessage
                      ? new Date(conv.updatedAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </span>
                </div>
                <p className={cx("last-message")}>
                  {conv.lastMessage ? conv.lastMessage.content : ""}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConversationList;
