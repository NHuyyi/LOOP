import { createSlice } from "@reduxjs/toolkit";

const commentSlice = createSlice({
  name: "comments",
  initialState: {}, // { [postId]: [commentTree] }
  reducers: {
    setComments: (state, action) => {
      const { postId, comments } = action.payload;
      if (!Array.isArray(comments)) return;

      const oldTree = state[postId] || [];

      // flatten để lấy toàn bộ comments cũ
      const flatten = (list) => {
        let res = [];
        for (let c of list) {
          res.push(c);
          if (c.replies?.length) res = res.concat(flatten(c.replies));
        }
        return res;
      };
      const oldFlat = flatten(oldTree);
      const oldMap = new Map(oldFlat.map((o) => [o._id, o]));

      // hàm gộp reaction từ oldMap
      const mergeReactions = (list) =>
        list.map((c) => {
          const old = oldMap.get(c._id);
          return {
            ...c,
            reactionCounts: old?.reactionCounts || c.reactionCounts || {},
            totalReactions: old?.totalReactions || c.totalReactions || 0,
            replies: c.replies?.length ? mergeReactions(c.replies) : [],
          };
        });

      // ✨ Bước lọc visible: chỉ giữ comment gốc có isVisible !== false
      // Lọc comments, đảm bảo chỉ giữ reply nếu parent cũng giữ
      const filterValidTree = (list, validIds = new Set()) => {
        return list
          .filter((c) => {
            // nếu không có parent => gốc, cho vào
            if (!c.parentId) {
              validIds.add(String(c._id));
              return true;
            }
            // nếu có parent thì chỉ cho vào khi parent nằm trong validIds
            if (validIds.has(String(c.parentId))) {
              validIds.add(String(c._id));
              return true;
            }
            return false;
          })
          .map((c) => ({
            ...c,
            replies: c.replies?.length
              ? filterValidTree(c.replies, validIds)
              : [],
          }));
      };

      // Áp dụng lọc trước rồi merge
      const visibleComments = filterValidTree(comments);
      state[postId] = mergeReactions(visibleComments);
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
        const inserted = insertRecursive(state[postId]);
        if (!inserted)
          console.warn("Không tìm thấy parentId:", comment.parentId);
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
    deleteComment: (state, action) => {
      const { postId, commentId } = action.payload;
      const updateRecursive = (list) =>
        list.map((c) =>
          c._id === commentId
            ? { ...c, isDeleted: true }
            : { ...c, replies: c.replies ? updateRecursive(c.replies) : [] }
        );

      state[postId] = updateRecursive(state[postId] || []);
    },
    updateComment: (state, action) => {
      const { postId, comment } = action.payload;
      const updateRecursive = (list) => {
        for (let c of list) {
          if (c._id === comment._id) {
            c.text = comment.text;
            return true;
          }
          if (c.replies?.length && updateRecursive(c.replies)) return true;
        }
        return false;
      };
      updateRecursive(state[postId] || []);
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
  deleteComment,
  updateComment,
  clearCommentsForPost,
} = commentSlice.actions;
export default commentSlice.reducer;

export const selectCommentsByPostId = (state, postId) =>
  Array.isArray(state.comments?.[postId]) ? state.comments[postId] : [];
