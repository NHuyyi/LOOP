import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ConversationList: [], // lưu trữ danh sách bạn bè đã chat + tin nhắn cuối cùng
  activeConversationId: null, // lưu trữ cuộc trò chuyện hiện tại đang mở
  currentMessages: [], // lưu trữ tin nhắn của cuộc trò chuyện hiện tại(mặc định 20 tin nhắn)
  aciveRteceiver: null, // thông tin người đang chat cùng
  // các state hỗ trợ phân trang khi cuộn chuột lên
  hasMore: true, // Biến cờ: dung để kiểm tra xem còn tin nhắn nào để tải hay không
  page: 1, // Trang hiện tại, bắt đầu từ 1
  miniChat: [], // mảng chứa danh sách bong bóng chat
  typingConversations: [],
  replyMessage: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setConversations: (state, action) => {
      state.ConversationList = action.payload; // lấy từ API lúc mới vào web
    },
    // Khi có tin nhắn mới (mình gửi hoặc người ta gửi), cập nhật lại "tin nhắn cuối" và đẩy người đó lên top 1
    updateLastMessage: (state, action) => {
      const { conversationId, message } = action.payload;
      const index = state.ConversationList.findIndex(
        (c) => c._id === conversationId,
      );

      if (index !== -1) {
        // cập nhật tin nhắn cuối
        state.ConversationList[index].lastMessage = message;
        // đẩy cuộc trò chuyện lên top 1
        const updatedConversation = state.ConversationList.splice(index, 1)[0];
        state.ConversationList.unshift(updatedConversation);
      }
    },

    // Quản lý cuộc trò chuyện hiện tại

    // khi click vào 1 người bạn -> tải 20 tin nhắn
    setInitialMessages: (state, action) => {
      state.activeConversationId = action.payload.conversationId;
      state.currentMessages = action.payload.messages; // mãng tin nhắn
      state.activeReceiver = action.payload.receiver;
      state.page = 1; // reset lại trang về 1
      state.hasMore = action.payload.messages.length === 20; // nếu đủ 20 tin nhắn thì còn trang tiếp theo, ngược lại hết tin nhắn để tải
    },
    // khi cuộn chuột lên -> tải thêm 20 tin nhắn cũ hơn
    loadMoreMessages: (state, action) => {
      const olderMessages = action.payload; // mãng tin nhắn cũ hơn
      // Nối tin nhắn cũ vào đầu danh sách tin nhắn hiện tại
      state.currentMessages = [...olderMessages, ...state.currentMessages];
      state.page += 1; // tăng trang lên 1
      state.hasMore = olderMessages.length >= 20;
    },
    // khi đang mở khung chat mà có tin nhắn mới
    addMessage: (state, action) => {
      if (state.activeConversationId === action.payload.conversationId) {
        state.currentMessages.push(action.payload.message); // thêm tin nhắn mới vào cuối danh sách
      }
    },
    setNewFriendChat: (state, action) => {
      state.activeConversationId = null;
      state.activeReceiver = action.payload.receiver;
      state.currentMessages = [];
      state.page = 1;
      state.hasMore = false;
    },

    OpenMiniChat: (state, action) => {
      const { receiver, conversationId } = action.payload;

      // kiểm tra xem khung chat này đã mở chưa
      const existingIndex = state.miniChat.findIndex(
        (c) => c.receiver._id === receiver._id,
      );
      // nếu chưa hiện thì thêm vào mảng
      if (existingIndex !== -1) {
        // hiện tối đa 3 khung nếu quá thì xóa cái cũ nhất đi
        if (state.miniChat.length >= 3) {
          state.miniChat.shift();
        }
        state.miniChat.push({
          receiver,
          conversationId,
          message: [],
          isOpen: true,
        });
      } else {
        // nếu mở rồi thì focus vào
        state.miniChat[existingIndex].isOpen = true;
      }
    },

    CloseMiniChat: (state, action) => {
      state.miniChat = state.miniChat.filter(
        (c) => c.receiver._id !== action.payload.receiver._id,
      );
    },

    setMiniChatMessages: (state, action) => {
      const { receiverId, messages, conversationId } = action.payload;
      const index = state.miniChat.findIndex(
        (c) => c.receiver._id === receiverId,
      );
      if (index !== -1) {
        state.miniChat[index].message = messages;
        if (conversationId) {
          state.miniChat[index].conversationId = conversationId;
        }
      }
    },
    markConversationAsRead: (state, action) => {
      const { conversationId, currentUserId } = action.payload;

      // Tìm cuộc trò chuyện trong mảng
      const conversation = state.ConversationList.find(
        (c) => c._id === conversationId,
      );
      // Xem kết quả tìm được

      // Nếu có tin nhắn cuối
      if (conversation && conversation.lastMessage) {
        const senderId =
          conversation.lastMessage.senderId?._id ||
          conversation.lastMessage.senderId;
        // Nếu tin nhắn cuối KHÔNG phải do mình gửi thì đổi status = "read"
        if (senderId !== currentUserId) {
          conversation.lastMessage.status = "read";
        }
        // Chỉ cập nhật nếu khung chat hiện tại đang mở đúng vào conversation vừa được đọc
        if (String(state.activeConversationId) === String(conversationId)) {
          state.currentMessages.forEach((msg) => {
            const msgSenderId = msg.senderId?._id || msg.senderId;

            // Nếu tin nhắn này do MÌNH gửi (tức là ID người gửi khác với ID của người đọc)
            // và trạng thái chưa phải là "read", thì chuyển thành "read"
            if (
              String(msgSenderId) !== String(currentUserId) &&
              msg.status !== "read"
            ) {
              msg.status = "read";
            }
          });
        }
      }
    },

    UpdateReactionMessage: (state, action) => {
      const { messageId, reactions, conversationId } = action.payload;

      // So sánh dạng chuỗi để tránh lỗi 1 bên là Object, 1 bên là String
      if (String(state.activeConversationId) === String(conversationId)) {
        const msgIndex = state.currentMessages.findIndex(
          (m) => String(m._id) === String(messageId),
        );
        if (msgIndex !== -1) {
          state.currentMessages[msgIndex].reactions = reactions;
        }
      }
    },
    setTyping: (state, action) => {
      const { conversationId, isTyping } = action.payload;
      if (isTyping && !state.typingConversations.includes(conversationId)) {
        state.typingConversations.push(conversationId);
      } else if (!isTyping) {
        state.typingConversations = state.typingConversations.filter(
          (id) => id !== conversationId,
        );
      }
    },

    setReplyMessage: (state, action) => {
      state.replyMessage = action.payload; // Lưu tin nhắn đang trả lời vào state
      console.log("Tin nhắn được chọn để trả lời:", state.replyMessage);
    },

    clearReplyMessage: (state) => {
      state.replyMessage = null; // Xóa tin nhắn đang trả lời khỏi state
    },

    revokeMessageInState: (state, action) => {
      const { messageId, conversationId } = action.payload;
      //This code finds the active conversation
      if (String(state.activeConversationId) === String(conversationId)) {
        // This code finds the index of the message with the specified messageId in the currentMessages array.
        const msgIndex = state.currentMessages.findIndex(
          (m) => String(m._id) === String(messageId),
        );
        // this code sets the isRevoked property of the message at the found index to true, indicating that the message has been revoked.
        if (msgIndex !== -1) {
          state.currentMessages[msgIndex].isrevoked = true;
        }
      }
      // This code finds the index of the conversation with the specified conversationId in the ConversationList array.
      const convIdex = state.ConversationList.findIndex(
        (c) => String(c._id) === String(conversationId),
      );
      // This code checks if the message revoked is the last message of the conversation, if it is then it also sets the isRevoked property of the lastMessage to true.
      if (convIdex !== -1) {
        if (
          state.ConversationList[convIdex].lastMessage &&
          String(state.ConversationList[convIdex].lastMessage._id) ===
            String(messageId)
        ) {
          state.ConversationList[convIdex].lastMessage.isrevoked = true;
        }
      }
    },
  },
});

export const {
  setConversations,
  updateLastMessage,
  setInitialMessages,
  loadMoreMessages,
  addMessage,
  setNewFriendChat,
  OpenMiniChat,
  CloseMiniChat,
  setMiniChatMessages,
  markConversationAsRead,
  UpdateReactionMessage,
  setTyping,
  setReplyMessage,
  clearReplyMessage,
  revokeMessageInState,
} = chatSlice.actions;

export default chatSlice.reducer;
