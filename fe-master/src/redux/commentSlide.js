// redux/commentSlice.js
import { createSlice } from "@reduxjs/toolkit";

const commentSlice = createSlice({
  name: "comments",
  initialState: {},
  reducers: {
    addComment: (state, action) => {
      const { postId, comment } = action.payload;
      if (!state[postId]) state[postId] = [];
      state[postId].push(comment);
    },
    setComments: (state, action) => {
      const { postId, comments } = action.payload;
      state[postId] = comments;
    },
  },
});

export const { addComment, setComments } = commentSlice.actions;
export default commentSlice.reducer;
