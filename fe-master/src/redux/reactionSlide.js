// redux/reactionSlice.js
import { createSlice } from "@reduxjs/toolkit";

const reactionSlice = createSlice({
  name: "reactions",
  initialState: {},
  reducers: {
    updateReaction: (state, action) => {
      const { postId, reactionCounts, totalReactions } = action.payload;
      state[postId] = { reactionCounts, totalReactions };
    },
  },
});

export const { updateReaction } = reactionSlice.actions;
export default reactionSlice.reducer;
