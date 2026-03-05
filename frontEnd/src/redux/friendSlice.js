import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  friends: [],
  filteredFriends: [],
  friendRequests: [],
  sentRequests: [],
  loading: false,
};

const friendSlice = createSlice({
  name: "friend",
  initialState,
  reducers: {
    // Lưu toàn bộ danh sách lấy từ API
    setFriendData: (state, action) => {
      state.friends = action.payload.friend || [];
      state.friendRequests = action.payload.friendRequests || [];
      state.sentRequests = action.payload.sentRequests || [];
    },

    // socket: có người vừa gửi lời mời kết bạn cho mình
    receiveFriendRequest: (state, action) => {
      state.friendRequests.push({ from: action.payload });
    },

    // socket: có người vừa hủy lời mời kết bạn đã gửi cho mình
    cancelReceivedRequest: (state, action) => {
      const senderId = action.payload; // ID của người vừa hủy lời mời
      // Phải lọc trong friendRequests
      state.friendRequests = state.friendRequests.filter(
        (r) => r.from._id !== senderId,
      );
    },

    // socket: chấp nhận lời mời kết bạn
    acceptFriendRequest: (state, action) => {
      const accepterId = action.payload;
      const request = state.sentRequests.find((r) => r.to._id === accepterId);
      if (request) {
        state.friends.push(request.to);
        state.sentRequests = state.sentRequests.filter(
          (r) => r.to._id !== accepterId,
        );
      }
    },

    acceptRequestLocal: (state, action) => {
      const senderId = action.payload;
      const request = state.friendRequests.find((r) => r.from._id === senderId);
      if (request) {
        state.friends.push(request.from);
        state.friendRequests = state.friendRequests.filter(
          (r) => r.from._id !== senderId,
        );
      }
    },

    // socket: từ chối lời mời kết bạn
    rejectFriendRequest: (state, action) => {
      const targetId = action.payload;

      // 1. Nếu mình là người gửi (người kia từ chối), xóa khỏi sentRequests
      state.sentRequests = state.sentRequests.filter(
        (r) => r.to._id !== targetId,
      );

      // 2. Nếu mình là người nhận (mình chủ động từ chối), xóa khỏi friendRequests
      state.friendRequests = state.friendRequests.filter(
        (r) => r.from._id !== targetId,
      );
    },

    // socket: xóa bạn bè
    removeFriend: (state, action) => {
      const friendId = action.payload; // id người vừa xóa mình
      state.friends = state.friends.filter((f) => f._id !== friendId);
    },

    // Khi BẠN tự bấm gửi lời mời kết bạn từ thanh tìm kiếm
    addSentRequest: (state, action) => {
      // action.payload sẽ là toàn bộ thông tin của người đó
      state.sentRequests.push({ to: action.payload });
    },

    // Khi BẠN tự bấm hủy lời mời kết bạn mình vừa gửi
    removeSentRequestLocal: (state, action) => {
      const receiverId = action.payload; // ID của người nhận
      state.sentRequests = state.sentRequests.filter(
        (r) => r.to._id !== receiverId,
      );
    },

    setFilteredFriends: (state, action) => {
      state.filteredFriends = action.payload;
    },

    updateChatInFilteredFriends: (state, action) => {
      const { friendId, conversationId } = action.payload;

      // Tìm vị trí của người bạn đó trong danh sách Cột 3 hiện tại
      const index = state.filteredFriends.findIndex((f) => f._id === friendId);

      if (index !== -1) {
        // Cập nhật lại conversationId cho họ (nếu trước đó chưa có)
        const updatedFriend = {
          ...state.filteredFriends[index],
          conversationId,
        };

        // Cắt họ ra khỏi vị trí cũ
        state.filteredFriends.splice(index, 1);

        // Nhét lên vị trí Top 1
        state.filteredFriends.unshift(updatedFriend);
      }
    },
  },
});

export const {
  addSentRequest,
  removeSentRequestLocal,
  setFriendData,
  receiveFriendRequest,
  cancelReceivedRequest,
  acceptFriendRequest,
  acceptRequestLocal,
  rejectFriendRequest,
  removeFriend,
  setFilteredFriends,
  updateChatInFilteredFriends,
} = friendSlice.actions;
export default friendSlice.reducer;
