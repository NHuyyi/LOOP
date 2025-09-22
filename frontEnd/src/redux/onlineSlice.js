// redux/onlineSlice.js
import { createSlice } from "@reduxjs/toolkit";

const onlineSlice = createSlice({
  name: "online",
  initialState: [],
  reducers: {
    setOnlineUsers: (state, action) => {
      return action.payload; // mảng userId online
    },
  },
});

export const { setOnlineUsers } = onlineSlice.actions;
export default onlineSlice.reducer;
