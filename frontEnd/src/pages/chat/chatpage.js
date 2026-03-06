import React from "react";
import styles from "./ChatPage.module.css";
import classNames from "classnames/bind";
import { useSelector } from "react-redux";

import ConversationList from "../../component/chat/Conversation/ConversationList";
import ChatHeader from "../../component/chat/ChatHeader/ChatHeader";
import MessageList from "../../component/chat/MessageList/MessageList";
import MessageInput from "../../component/chat/MessageInput/MessageInput";

const cx = classNames.bind(styles);

function Chat() {
  // lấy trạng thái xem đã có cuộc trò chuyện nào đã được chọn chưa
  const { activeConversationId, activeReceiver } = useSelector(
    (state) => state.chat,
  );

  return (
    <div className={cx("container")}>
      {/* cột trái: nơi hiện danh sách cuộc trò chuyện*/}
      <div className={cx("sidebar")}>
        <ConversationList />
      </div>

      {/* Cột phải: khu vực hiển thị tin nhắn*/}
      <div className={cx("chatArea")}>
        {activeConversationId || activeReceiver ? (
          <>
            <ChatHeader onOpenModal={() => console.log("Open Info")} />
            <MessageList />
            <MessageInput />
          </>
        ) : (
          <div className={cx("noChatSelected")}>
            <img
              src="https://res.cloudinary.com/dpym64zg9/image/upload/v1755614090/raw_cq4nqn.png"
              alt="Welcome"
              className={cx("welcomeImg")}
            />
            <h3>Chọn một đoạn chat hoặc bắt đầu cuộc trò chuyện mới</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
