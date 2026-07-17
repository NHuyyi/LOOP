import React, { useState } from "react";
import styles from "./ChatPage.module.css";
import classNames from "classnames/bind";
import { useSelector } from "react-redux";

import ChatSidebar from "../../component/chat/ChatSidebar/ChatSidebar";
import ConversationListComponent from "../../component/chat/Conversation/ConversationList";
// Import RestrictedList (bạn đã tạo ở bước trước)
import RestrictedList from "../../component/chat/ChatSidebar/RestrictedList/RestrictedList";

import ChatHeader from "../../component/chat/ChatHeader/ChatHeader";
import MessageList from "../../component/chat/MessageList/MessageList";
import MessageInput from "../../component/chat/MessageInput/MessageInput";
import MenuConverSation from "../../component/chat/MenuConversation/MenuConversation";

const cx = classNames.bind(styles);

function Chat() {
  const {
    activeConversationId,
    activeReceiver,
    ConversationList = [],
  } = useSelector((state) => state.chat);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // State quản lý xem Cột 2 đang hiển thị danh sách nào
  const [activeView, setActiveView] = useState("conversations");

  const stateUser = useSelector((state) => state.user);
  const currentUser = stateUser?.user;
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
        (user) => user._id !== currentUser._id,
      );
      if (
        currentConv.mutedBy &&
        currentConv.mutedBy.includes(currentUser._id)
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
      {/* 1. CỘT SIDEBAR (Thu/Phóng độc lập) */}
      <ChatSidebar activeView={activeView} setActiveView={setActiveView} />

      {/* 2. CỘT DANH SÁCH (Hiển thị linh hoạt) */}
      <div className={cx("sidebar")}>
        <div className={cx("sidebarHeader")}>
          <h2 className={cx("sidebarTitle")}>
            {activeView === "conversations" && "Đoạn chat"}
            {activeView === "search" && "Tìm kiếm"}
            {activeView === "restricted" && "Hạn chế"}
            {activeView === "blocked" && "Danh sách chặn"}
            {activeView === "settings" && "Cài đặt"}
          </h2>
        </div>
        <div className={cx("conversationWrapper")}>
          {activeView === "conversations" && <ConversationListComponent />}
          {activeView === "restricted" && <RestrictedList />}
          {activeView !== "conversations" && activeView !== "restricted" && (
            <div
              style={{ padding: "20px", textAlign: "center", color: "#888" }}
            >
              Tính năng đang phát triển...
            </div>
          )}
        </div>
      </div>

      {/* 3. KHU VỰC HIỂN THỊ TIN NHẮN */}
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
            <h3>Chọn đoạn chat hoặc bắt đầu cuộc trò chuyện mới</h3>
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
