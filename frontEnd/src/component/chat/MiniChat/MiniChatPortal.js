import React from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import MiniChatNode from "./MiniChatNode";
import styles from "./MiniChat.module.css";

export default function MiniChatPortal() {
  const location = useLocation();
  const miniChats = useSelector((state) => state.chat.miniChat);

  // Nếu đang ở trang chat chính thì không hiển thị Mini Chat
  if (location.pathname.startsWith("/chat")) {
    return null;
  }

  // Nếu mảng miniChat trong Redux trống thì không render gì cả
  if (!miniChats || miniChats.length === 0) {
    return null;
  }

  return createPortal(
    <div className={styles.portalContainer}>
      {miniChats.map((chat, index) => (
        <MiniChatNode key={chat.receiver._id} chatData={chat} index={index} />
      ))}
    </div>,
    document.body,
  );
}
