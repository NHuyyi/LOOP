import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ConversationList: [], // lưu trữ danh sách bạn bè đã chat + tin nhắn cuối cùng
  activeConversationId: null, // lưu trữ cuộc trò chuyện hiện tại đang mở
  currentMessages: [], // lưu trữ tin nhắn của cuộc trò chuyện hiện tại(mặc định 20 tin nhắn)
  activeReceiver: null, // thông tin người đang chat cùng
  // các state hỗ trợ phân trang khi cuộn chuột lên
  hasMore: true, // Biến cờ: dung để kiểm tra xem còn tin nhắn nào để tải hay không
  page: 1, // Trang hiện tại, bắt đầu từ 1
  miniChat: [], // mảng chứa danh sách bong bóng chat
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
      console.log("Dữ liệu nhận được:", action.payload);
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

      // Nếu có tin nhắn cuối
      if (conversation && conversation.lastMessage) {
        const senderId =
          conversation.lastMessage.senderId?._id ||
          conversation.lastMessage.senderId;

        // Nếu tin nhắn cuối KHÔNG phải do mình gửi thì đổi status = "read"
        if (senderId !== currentUserId) {
          conversation.lastMessage.status = "read";
        }
      }
    },

    UpdateReactionMessage: (state, action) => {
      const { messageId, reactions, conversationId } = action.payload;
      if (state.activeConversationId === conversationId) {
        const msgIndex = state.currentMessages.findIndex(
          (m) => m._id === messageId,
        );
        if (msgIndex !== -1) {
          state.currentMessages[msgIndex].reactions = reactions;
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
} = chatSlice.actions;

export default chatSlice.reducer;
