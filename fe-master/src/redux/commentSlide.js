import { createSlice } from "@reduxjs/toolkit";

const commentSlice = createSlice({
  name: "comments",
  initialState: {}, // { [postId]: [commentTree] }
  reducers: {
    setComments: (state, action) => {
      const { postId, comments } = action.payload;
      if (!Array.isArray(comments)) return;

      const oldTree = state[postId] || [];

      // flatten old để tìm nhanh reaction cũ
      const flatten = (list) => {
        let res = [];
        for (let c of list) {
          res.push(c);
          if (c.replies?.length) res = res.concat(flatten(c.replies));
        }
        return res;
      };
      const oldFlat = flatten(oldTree);

      const mergeReactions = (list) =>
        list.map((c) => {
          const old = oldFlat.find((o) => o._id === c._id);
          return {
            ...c,
            reactionCounts: old?.reactionCounts || c.reactionCounts || {},
            totalReactions: old?.totalReactions || c.totalReactions || 0,
            replies: c.replies?.length ? mergeReactions(c.replies) : [],
          };
        });

      state[postId] = mergeReactions(comments);
    },

    addComment: (state, action) => {
      const { postId, comment } = action.payload;
      if (!Array.isArray(state[postId])) state[postId] = [];

      const newComment = {
        ...comment,
        replies: [],
        reactionCounts: comment.reactionCounts || {},
        totalReactions: comment.totalReactions || 0,
      };

      if (comment.parentId) {
        // tìm cha và chèn vào replies
        const insertRecursive = (list) => {
          for (let c of list) {
            if (c._id === comment.parentId) {
              c.replies = c.replies || [];
              c.replies.push(newComment);
              return true;
            }
            if (c.replies?.length && insertRecursive(c.replies)) {
              return true;
            }
          }
          return false;
        };
        insertRecursive(state[postId]);
      } else {
        // comment gốc
        state[postId].push(newComment);
      }
    },

    updateCommentReaction: (state, action) => {
      const { postId, commentId, reactionCounts, totalReactions } =
        action.payload;
      const comments = state[postId];
      if (!Array.isArray(comments)) return;

      const updateRecursive = (list) => {
        for (let c of list) {
          if (c._id === commentId) {
            c.reactionCounts = reactionCounts;
            c.totalReactions = totalReactions;
            return true;
          }
          if (c.replies?.length && updateRecursive(c.replies)) {
            return true;
          }
        }
        return false;
      };

      updateRecursive(comments);
    },

    clearCommentsForPost: (state, action) => {
      const postId = action.payload;
      delete state[postId];
    },
  },
});

export const {
  setComments,
  addComment,
  updateCommentReaction,
  clearCommentsForPost,
} = commentSlice.actions;
export default commentSlice.reducer;

export const selectCommentsByPostId = (state, postId) =>
  Array.isArray(state.comments?.[postId]) ? state.comments[postId] : [];
