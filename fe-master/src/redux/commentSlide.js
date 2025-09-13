// redux/commentSlice.js
import { createSlice } from "@reduxjs/toolkit";

const commentSlice = createSlice({
  name: "comments",
  initialState: {}, // { [postId]: [comment, ...] }
  reducers: {
    addComment: (state, action) => {
      const { postId, comment } = action.payload;
      if (!Array.isArray(state[postId])) state[postId] = [];
      state[postId].push(comment);
    },
    setComments: (state, action) => {
      const { postId, comments } = action.payload;
      state[postId] = Array.isArray(comments) ? comments : [];
    },
    clearCommentsForPost: (state, action) => {
      const postId = action.payload;
      delete state[postId];
    },
  },
});

export const { addComment, setComments, clearCommentsForPost } =
  commentSlice.actions;
export default commentSlice.reducer;

// selector helper
export const selectCommentsByPostId = (state, postId) =>
  Array.isArray(state.comments?.[postId]) ? state.comments[postId] : [];
