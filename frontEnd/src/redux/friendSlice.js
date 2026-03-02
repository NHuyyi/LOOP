import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  friends: [],
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
      const receiverId = action.payload; // id người gửi lời mời

      state.sentRequests = state.sentRequests.filter(
        (r) => r.to._id !== receiverId,
      );
    },

    // socket: chấp nhận lời mời kết bạn
    acceptFriendRequest: (state, action) => {
      const accepterId = action.payload; // id người vừa bấm chấp nhận

      // ✅ Mình là người đã gửi, nên phải tìm trong sentRequests
      const request = state.sentRequests.find((r) => r.to._id === accepterId);

      if (request) {
        state.friends.push(request.to); // thêm vào danh sách bạn bè
        // ✅ Xóa khỏi sentRequests
        state.sentRequests = state.sentRequests.filter(
          (r) => r.to._id !== accepterId,
        );
      }
    },

    // socket: từ chối lời mời kết bạn
    rejectFriendRequest: (state, action) => {
      const rejectorId = action.payload; // id người được gửi lời mời
      state.sentRequests = state.sentRequests.filter(
        (r) => r.to._id !== rejectorId,
      ); // xóa khỏi sentRequests
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
  },
});

export const {
  addSentRequest,
  removeSentRequestLocal,
  setFriendData,
  receiveFriendRequest,
  cancelReceivedRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
} = friendSlice.actions;
export default friendSlice.reducer;
