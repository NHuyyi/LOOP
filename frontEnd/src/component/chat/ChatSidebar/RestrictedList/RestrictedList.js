import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import classNames from "classnames/bind";
import styles from "./RestrictedList.module.css";
import { toggleRestrictConversationAPI } from "../../../../services/chat/toggleRestrictConversation";
import { moveConversationToNormal } from "../../../../redux/chatSlice";
import Loading from "../../../Loading/Loading";

const cx = classNames.bind(styles);

function RestrictedList() {
  const dispatch = useDispatch();
  const stateUser = useSelector((state) => state.user);
  const currentUser = stateUser?.user;
  const restrictedList = useSelector(
    (state) => state.chat.RestrictedConversationList,
  );

  const [processingId, setProcessingId] = useState(null);

  const handleUnrestrict = async (conversation) => {
    setProcessingId(conversation._id);
    try {
      const res = await toggleRestrictConversationAPI(conversation._id);
      if (res.success) {
        // Cập nhật lại UI lập tức: Đẩy lại về danh sách chat thường
        dispatch(moveConversationToNormal(conversation));
      }
    } catch (error) {
      console.error("Lỗi khi bỏ hạn chế:", error);
    } finally {
      setProcessingId(null);
    }
  };

  if (!restrictedList || restrictedList.length === 0) {
    return (
      <div className={cx("empty-msg")}>
        Không có cuộc trò chuyện nào bị hạn chế.
      </div>
    );
  }

  return (
    <div className={cx("restricted-container")}>
      {restrictedList.map((conv) => {
        // Tìm người dùng bị hạn chế (khác với current user)
        const otherUser = conv.participants.find(
          (p) => p._id !== currentUser._id,
        );

        return (
          <div key={conv._id} className={cx("restricted-item")}>
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
            <button
              className={cx("unrestrict-btn")}
              onClick={() => handleUnrestrict(conv)}
              disabled={processingId === conv._id}
            >
              {processingId === conv._id ? (
                <Loading size="small" />
              ) : (
                "Bỏ hạn chế"
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default RestrictedList;
