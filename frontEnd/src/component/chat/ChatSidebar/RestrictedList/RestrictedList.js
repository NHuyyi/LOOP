import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import classNames from "classnames/bind";
import styles from "./RestrictedList.module.css";
import { getRestrictedConversations } from "../../../../services/chat/getRestrictedConversations";
import {
  setRestrictedConversations,
  setInitialMessages,
} from "../../../../redux/chatSlice";
import Loading from "../../../Loading/Loading";
import ToggleRestrictButton from "../../MenuConversation/ToggleRestrictButton/ToggleRestrictButton";
import { getMessages } from "../../../../services/chat/getMessages";
const cx = classNames.bind(styles);

function RestrictedList() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const stateUser = useSelector((state) => state.user);
  const currentUser = stateUser?.user;
  const restrictedList = useSelector(
    (state) => state.chat.RestrictedConversationList,
  );

  useEffect(() => {
    const fetchRestrictedList = async () => {
      setIsLoading(true);
      try {
        const res = await getRestrictedConversations();
        if (res.success) {
          dispatch(setRestrictedConversations(res.conversations));
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách hạn chế:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestrictedList();
  }, [dispatch]);

  // THÊM HÀM NÀY: Mở khung chat để xem tin nhắn
  const handleViewRestrictedChat = async (conversation, otherUser) => {
    try {
      // Chỉ lấy tin nhắn về để xem
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

      // LƯU Ý: Tuyệt đối KHÔNG gọi hàm markAsRead(conversation._id) ở đây
      // Vì bản chất của Hạn chế là đọc lén không để lại "Đã xem" (Seen)
    } catch (error) {
      console.error("Lỗi khi lấy tin nhắn hạn chế:", error);
    }
  };

  if (isLoading) {
    return (
      <div className={cx("empty-msg")}>
        <Loading size="small" /> Đang tải...
      </div>
    );
  }

  if (!restrictedList || restrictedList.length === 0) {
    return (
      <div className={cx("empty-msg")}>
        Không có cuộc trò chuyện bị hạn chế.
      </div>
    );
  }

  return (
    <div className={cx("restricted-container")}>
      {restrictedList.map((conv) => {
        const otherUser = conv.participants.find(
          (p) => p._id !== currentUser._id,
        );
        return (
          // Thêm sự kiện onClick vào thẻ div bọc ngoài
          <div
            key={conv._id}
            className={cx("restricted-item")}
            onClick={() => handleViewRestrictedChat(conv, otherUser)}
            style={{ cursor: "pointer" }} // Thêm cursor pointer cho giống list thường
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
              <h4 className={cx("name")}>{otherUser?.name || "Người dùng"}</h4>
            </div>

            {/* Chặn sự kiện nổi bọt (stopPropagation) để bấm nút "Bỏ hạn chế" 
                không bị kích hoạt luôn sự kiện mở chat */}
            <div onClick={(e) => e.stopPropagation()}>
              <ToggleRestrictButton
                conversationId={conv._id}
                isRestricted={true}
                className={cx("unrestrict-btn")}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default RestrictedList;
