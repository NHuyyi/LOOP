import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import MiniChatNode from "./MiniChatNode";
import styles from "./MiniChat.module.css";
// Import các hàm API và Action cần thiết
import { getConversations } from "../../../services/chat/getConversations";
import { setConversations, OpenMiniChat } from "../../../redux/chatSlice";

export default function MiniChatPortal() {
  const location = useLocation();
  const dispatch = useDispatch();

  const miniChats = useSelector((state) => state.chat.miniChat);
  const currentUser = useSelector((state) => state.user.user);

  // Gọi API lấy danh sách khi vào web và check tin nhắn chưa đọc
  useEffect(() => {
    if (currentUser?._id) {
      const fetchInitialConversations = async () => {
        try {
          const res = await getConversations();
          if (res && res.success) {
            // 🌟 THÊM DÒNG NÀY: Lấy mảng từ res.data, nếu undefined thì lấy res.conversations, hoặc mảng rỗng
            const convList = res.data || res.conversations || [];

            // 1. Lưu danh sách vào Redux
            dispatch(setConversations(convList));

            // 2. Tìm các cuộc trò chuyện có tin nhắn chưa đọc
            const unreadConvs = convList.filter((conv) => {
              // Thay res.data thành convList
              const lastMsg = conv.lastMessage;
              if (!lastMsg) return false;

              const senderId = lastMsg.senderId?._id || lastMsg.senderId;
              return (
                String(senderId) !== String(currentUser._id) &&
                lastMsg.status !== "read"
              );
            });

            // 3. Mở MiniChat (tối đa 3 bong bóng)
            unreadConvs.slice(0, 3).forEach((conv) => {
              const otherUser = conv.participants.find(
                (p) => String(p._id) !== String(currentUser._id),
              );
              if (otherUser) {
                dispatch(
                  OpenMiniChat({
                    receiver: otherUser,
                    conversationId: conv._id,
                    triggerBy: "socket", // Dùng 'socket' để chỉ hiện bong bóng, không mở to cửa sổ che màn hình
                  }),
                );
              }
            });
          }
        } catch (error) {
          console.error(
            "Lỗi khi tải danh sách chat tại MiniChatPortal:",
            error,
          );
        }
      };

      fetchInitialConversations();
    }
  }, [currentUser, dispatch]);

  // LUÔN ĐẶT CÁC LỆNH RETURN Ở DƯỚI CÙNG SAU KHI ĐÃ GỌI HOOKS
  // Nếu đang ở trang chat chính thì không hiển thị MiniChat
  if (location.pathname.startsWith("/chat")) {
    return null;
  }

  // Nếu không có chat nào mở thì không render gì cả
  if (!miniChats || miniChats.length === 0) {
    return null;
  }

  return createPortal(
    <div className={styles.portalContainer}>
      {miniChats.map((chat) => {
        const chatId = chat.receiver._id;

        // Chỉ tính vị trí trong nhóm các cửa sổ đang mở
        const windowIndex = miniChats
          .filter((item) => item.isWindowOpen)
          .findIndex((item) => item.receiver._id === chatId);

        // Chỉ tính vị trí trong nhóm các bong bóng đang thu nhỏ
        const bubbleIndex = miniChats
          .filter((item) => !item.isWindowOpen)
          .findIndex((item) => item.receiver._id === chatId);

        return (
          <MiniChatNode
            key={chatId}
            chatData={chat}
            windowIndex={windowIndex}
            bubbleIndex={bubbleIndex}
          />
        );
      })}
    </div>,
    document.body,
  );
}
