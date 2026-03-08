import React, { useEffect, useState } from "react";
import styles from "./ConversationList.module.css";
import classNames from "classnames/bind";
import { useSelector, useDispatch } from "react-redux";

// Import API và Redux
import getFriendList from "../../../services/Friends/getFriendList";
import { getConversations } from "../../../services/chat/getConversations";
import { getMessages } from "../../../services/chat/getMessages";
import {
  setConversations,
  setInitialMessages,
  setNewFriendChat,
} from "../../../redux/chatSlice";

// Import Component con
import ChatSearch from "./ChatSearch";

const cx = classNames.bind(styles);

const ConversationList = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [localFriends, setLocalFriends] = useState([]);

  const stateUser = useSelector((state) => state.user);
  const currentUser = stateUser?.user;

  const { ConversationList = [], activeConversationId } = useSelector(
    (state) => state.chat || [],
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [convRes = [], friendRes = []] = await Promise.all([
          getConversations(currentUser?._id),
          getFriendList(currentUser?._id),
        ]);
        if (convRes?.success)
          dispatch(setConversations(convRes.conversations || []));
        if (friendRes?.success) setLocalFriends(friendRes.friend || []);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu chat/bạn bè:", error);
      } finally {
        setLoading(false);
      }
    };

    if (
      currentUser &&
      (ConversationList.length === 0 || localFriends.length === 0)
    ) {
      fetchData();
    }
  }, [currentUser, dispatch, ConversationList.length, localFriends.length]);

  const handleConversationClick = async (conversation) => {
    if (activeConversationId === conversation._id) return;

    try {
      const res = await getMessages(conversation._id, 1);

      if (res?.success) {
        dispatch(
          setInitialMessages({
            conversationId: conversation._id,
            messages: res.messages,
          }),
        );
      }
    } catch (error) {
      console.error("Lỗi lấy tin nhắn:", error);
    }
  };

  const handleSearchResultClick = (targetUser) => {
    const existingConv = ConversationList.find((conv) =>
      conv.participants.some((p) => p._id === targetUser._id),
    );

    if (existingConv) {
      handleConversationClick(existingConv);
    } else {
      dispatch(setNewFriendChat({ receiver: targetUser }));
      console.log("Đã click", targetUser);
    }
    setSearchText("");
  };

  // --- CÁC HÀM RENDER COMPONENT CON ---

  const renderSearchResults = () => {
    const filteredFriends = localFriends.filter((friend) =>
      friend.name.toLowerCase().includes(searchText.toLowerCase()),
    );

    return filteredFriends.map((friend) => (
      <div
        key={friend._id}
        className={cx("item")}
        onClick={() => handleSearchResultClick(friend)}
      >
        <img
          src={
            friend.avatar ||
            "https://res.cloudinary.com/dpym64zg9/image/upload/v1755614090/raw_cq4nqn.png"
          }
          alt="avatar"
          className={cx("avatar")}
        />
        <div className={cx("info")}>
          <div className={cx("name-time")}>
            <h4>{friend.name}</h4>
          </div>
        </div>
      </div>
    ));
  };

  const renderConversationHistory = () => {
    return ConversationList.map((conv) => {
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
              otherUser?.avatar ||
              "https://res.cloudinary.com/dpym64zg9/image/upload/v1755614090/raw_cq4nqn.png"
            }
            alt="avatar"
            className={cx("avatar")}
          />
          <div className={cx("info")}>
            <div className={cx("name-time")}>
              <h4>{otherUser?.name}</h4>
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
    });
  };

  // --- RENDER CHÍNH ---
  return (
    <div className={cx("container")}>
      <ChatSearch searchText={searchText} setSearchText={setSearchText} />

      <div className={cx("list")}>
        {loading && <div className={cx("spinner-border")} />}

        {/* Logic hiển thị siêu gọn gàng */}
        {!loading && searchText.trim()
          ? renderSearchResults()
          : renderConversationHistory()}
      </div>
    </div>
  );
};

export default ConversationList;
