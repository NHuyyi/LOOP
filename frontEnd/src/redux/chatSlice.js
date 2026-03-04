import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  conversationsList: [], // lưu trữ danh sách bạn bè đã chat + tin nhắn cuối cùng
  activeConversationId: null, // lưu trữ cuộc trò chuyện hiện tại đang mở
  currentMessages: [], // lưu trữ tin nhắn của cuộc trò chuyện hiện tại(mặc định 20 tin nhắn)

  // các state hỗ trợ phân trang khi cuộn chuột lên
  hasMore: true, // Biến cờ: dung để kiểm tra xem còn tin nhắn nào để tải hay không
  page: 1, // Trang hiện tại, bắt đầu từ 1
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setConversations: (state, action) => {
      state.conversationsList = action.payload; // lấy từ API lúc mới vào web
    },
    // Khi có tin nhắn mới (mình gửi hoặc người ta gửi), cập nhật lại "tin nhắn cuối" và đẩy người đó lên top 1
    updateLastMessage: (state, action) => {
      const { conversationId, message } = action.payload;
      const index = state.conversationsList.findIndex(
        (c) => c._id === conversationId,
      );

      if (index !== -1) {
        // cập nhật tin nhắn cuối
        state.conversationsList[index].lastMessage = message;
        // đẩy cuộc trò chuyện lên top 1
        const updatedConversation = state.conversationsList.splice(index, 1)[0];
        state.conversationsList.unshift(updatedConversation);
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
      if (state.activeConversationId === action.payload.conversationId) {
        state.currentMessages.push(action.payload); // thêm tin nhắn mới vào cuối danh sách
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
} = chatSlice.actions;

export default chatSlice.reducer;
