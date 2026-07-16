import React from "react";
import styles from "./ChatPage.module.css";
import classNames from "classnames/bind";
import { useSelector } from "react-redux";

import ConversationListComponent from "../../component/chat/Conversation/ConversationList";
import ChatHeader from "../../component/chat/ChatHeader/ChatHeader";
import MessageList from "../../component/chat/MessageList/MessageList";
import MessageInput from "../../component/chat/MessageInput/MessageInput";
import MenuConverSation from "../../component/chat/MenuConversation/MenuConversation";

const cx = classNames.bind(styles);

function Chat() {
  // lấy trạng thái xem đã có cuộc trò chuyện nào đã được chọn chưa
  const {
    activeConversationId,
    activeReceiver,
    ConversationList = [],
  } = useSelector((state) => state.chat);

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const currentUser = useSelector((state) => state.user);
  const onlineUsers = useSelector((state) => state.online);

  let otherUser = null;
  let isOnline = false;
  let isMuted = false;

  if (activeConversationId) {
    const currentConv = ConversationList.find(
      (conv) => conv._id === activeConversationId,
    );
    if (currentConv) {
      otherUser = currentConv.participants.find(
        (user) => user._id !== currentUser.user._id,
      );
      if (
        currentConv.mutedBy &&
        currentConv.mutedBy.includes(currentUser.user._id)
      ) {
        isMuted = true;
      }
    }
  } else if (activeReceiver) {
    otherUser = activeReceiver;
  }

  if (otherUser) {
    isOnline = onlineUsers.includes(otherUser._id);
  }
  return (
    <div className={cx("container")}>
      {/* cột trái: nơi hiện danh sách cuộc trò chuyện*/}
      <div className={cx("sidebar")}>
        <ConversationListComponent />
      </div>

      {/* Cột phải: khu vực hiển thị tin nhắn*/}
      <div className={cx("chatArea")}>
        {activeConversationId || activeReceiver ? (
          <>
            <ChatHeader onOpenModal={() => setIsMenuOpen(true)} />
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
      <MenuConverSation
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        otherUser={otherUser}
        isOnline={isOnline}
        conversationId={activeConversationId}
        initialIsMuted={isMuted}
      />
    </div>
  );
}

export default Chat;
