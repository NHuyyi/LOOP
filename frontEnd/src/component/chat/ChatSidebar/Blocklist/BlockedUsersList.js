// Đường dẫn: frontEnd/src/component/chat/ChatSidebar/BlockedList/BlockedUserList.js
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import classNames from "classnames/bind";
import styles from "./BlockedUserList.module.css";
import { getBlockList } from "../../../../services/User/getBlockList";
import { getMessages } from "../../../../services/chat/getMessages";
import {
  setBlockedConversations,
  setInitialMessages,
} from "../../../../redux/chatSlice";
import blockUser from "../../../../services/User/blockUser";
import Loading from "../../../Loading/Loading";

const cx = classNames.bind(styles);

function BlockedUserList() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const stateUser = useSelector((state) => state.user);
  const currentUser = stateUser?.user;

  const blockedList =
    useSelector((state) => state.chat.BlockedConversationList) || [];
  const activeConversationId = useSelector(
    (state) => state.chat.activeConversationId,
  );

  useEffect(() => {
    const fetchBlockedList = async () => {
      setIsLoading(true);
      try {
        const res = await getBlockList();
        if (res.success) {
          dispatch(setBlockedConversations(res.conversations));
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách chặn:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlockedList();
  }, [dispatch]);

  // KHI CLICK VÀO ITEM SẼ MỞ ĐOẠN CHAT (ĐỂ ĐỌC TIN NHẮN CŨ)
  const handleConversationClick = async (conversation, otherUser) => {
    if (activeConversationId === conversation._id) return;
    try {
      const res = await getMessages(conversation._id, 1);
      if (res?.success) {
        dispatch(
          setInitialMessages({
            conversationId: conversation._id,
            messages: res.messages,
            receiver: otherUser,
          }),
        );
      }
    } catch (error) {
      console.error("Lỗi lấy tin nhắn cũ:", error);
    }
  };

  const handleUnblock = async (e, targetUserId) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click mở đoạn chat
    try {
      await blockUser(targetUserId);
      // Socket sẽ lo việc remove khỏi list này và đưa lại về list bình thường
    } catch (error) {
      console.error("Lỗi khi bỏ chặn:", error);
    }
  };

  return (
    <div className={cx("container")}>
      {isLoading ? (
        <Loading size="small" />
      ) : blockedList.length > 0 ? (
        <div className={cx("list")}>
          {blockedList.map((conv) => {
            const otherUser = conv.participants.find(
              (p) => String(p._id) !== String(currentUser._id),
            );
            if (!otherUser) return null;

            const isActive = activeConversationId === conv._id;

            return (
              <div
                key={conv._id}
                className={cx("item", { active: isActive })}
                onClick={() => handleConversationClick(conv, otherUser)}
              >
                <img
                  src={otherUser.avatar || "/default-avatar.png"}
                  alt="avatar"
                  className={cx("avatar")}
                />
                <div className={cx("info")}>
                  <div className={cx("name-time")}>
                    <h4>{otherUser.name}</h4>
                  </div>
                  <p className={cx("last-message")}>Đã chặn tài khoản này</p>
                </div>
                <button
                  className={cx("unblockBtn")}
                  onClick={(e) => handleUnblock(e, otherUser._id)}
                >
                  Bỏ chặn
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: "center", color: "#888", marginTop: "20px" }}>
          Bạn chưa chặn ai.
        </div>
      )}
    </div>
  );
}

export default BlockedUserList;
