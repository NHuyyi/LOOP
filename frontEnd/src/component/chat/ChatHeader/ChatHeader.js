import React from "react";
import styles from "./ChatHeader.module.css";
import classNames from "classnames/bind";
import { Info } from "lucide-react";
import { useSelector } from "react-redux";

const cx = classNames.bind(styles);

function ChatHeader({ onOpenModal }) {
  const stateUser = useSelector((state) => state.user);
  const currentUser = stateUser?.user;
  const { ConversationList, activeConversationId } = useSelector(
    (state) => state.chat,
  );

  // tìm thông tin cuộc trò chuyện hiện tại
  const currentConv = ConversationList.find(
    (c) => c._id === activeConversationId,
  );

  if (!currentConv) return null;

  const otherUser = currentConv.participants.find(
    (p) => p._id !== currentUser._id,
  );

  return (
    <div className={cx("header")}>
      <div className={cx("userInfo")}>
        <img src={otherUser.avatar} alt="avatar" className={cx("avatar")} />
        <div className={cx("nameAndStatus")}>
          <h4>{otherUser?.name}</h4>
        </div>
      </div>
      <button className={cx("infoButton")} onClick={onOpenModal}>
        <Info className={cx("infoIcon")} size={24} />
      </button>
    </div>
  );
}

export default ChatHeader;
