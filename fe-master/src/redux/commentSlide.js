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
    updateCommentReaction: (state, action) => {
      const { postId, commentId, reactionCounts, totalReactions } =
        action.payload;
      const comments = state[postId];
      if (!Array.isArray(comments)) return;

      const comment = comments.find((c) => c._id === commentId);
      if (comment) {
        comment.reactionCounts = reactionCounts;
        comment.totalReactions = totalReactions;
      }
    },
    clearCommentsForPost: (state, action) => {
      const postId = action.payload;
      delete state[postId];
    },
  },
});

export const {
  addComment,
  setComments,
  clearCommentsForPost,
  updateCommentReaction,
} = commentSlice.actions;
export default commentSlice.reducer;

// selector helper
export const selectCommentsByPostId = (state, postId) =>
  Array.isArray(state.comments?.[postId]) ? state.comments[postId] : [];
