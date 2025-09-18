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
      // nguyên lý hoạt động
      // - Bình luận A
      //   - Trả lời A1
      //     - Trả lời A1.1
      //   - Trả lời A2
      // - Bình luận B
      //  * Khi gọi flatten([A, B]), hàm sẽ thực hiện:
      // - Xét bình luận A → thêm vào res
      // - Thấy A có replies → gọi flatten([A1, A2])
      // - Xét A1 → thêm vào res
      // - Thấy A1 có replies → gọi flatten([A1.1])
      // - Xét A1.1 → thêm vào res
      // - Không có replies → kết thúc nhánh này
      // - Xét A2 → thêm vào res
      // - Không có replies → kết thúc nhánh này
      // - Quay lại bình luận B → thêm vào res
      // - Không có replies → kết thúc nhánh
      // - Không còn bình luận nào khác trong mảng  -> kết thúc
      // * kết quá:
      //  [
      //   A,
      //   A1,
      //   A1.1,
      //   A2,
      //   B
      // ]

      const flatten = (list) => {
        let res = [];
        for (let c of list) {
          res.push(c);
          if (c.replies?.length) res = res.concat(flatten(c.replies));
        }
        return res;
      };
      const oldFlat = flatten(oldTree);
      // nguyên lý hoạt động:
      // - Duyệt qua từng comment trong list (là cây bình luận mới).
      // - Với mỗi comment c:
      // - Tìm comment cũ trong oldFlat có cùng _id → gọi là old.
      // - Gộp thông tin phản ứng:
      // - Nếu old tồn tại → dùng old.reactionCounts và old.totalReactions.
      // - Nếu không có old → dùng dữ liệu từ c (comment mới).
      // - Nếu cả hai đều không có → mặc định là {} và 0.
      // - Xử lý replies:
      // - Nếu comment c có replies, gọi lại chính hàm mergeReactions để xử lý replies đó theo cách tương tự (đệ quy).
      // - Trả về một mảng mới gồm các comment đã được gộp thông tin phản ứng.
      // ví dụ minh họa:
      // - ta có hàm chứa cấy comment cũ
      // const oldFlat = [
      //   { _id: "1", reactionCounts: { like: 2 }, totalReactions: 2 },
      //   { _id: "2", reactionCounts: { like: 5 }, totalReactions: 5 },
      // ];
      // - ta có hàm chứa danh sách comment mới(comment sẽ ghi đè lên)
      // const newComments = [
      //   {
      //     _id: "1",
      //     content: "Bình luận mới 1",
      //     replies: [
      //       {
      //         _id: "2",
      //         content: "Trả lời mới 2",
      //         replies: [],
      //       },
      //     ],
      //   },
      // ];
      // Sau khi gọi mergeReactions(newComments), ta sẽ nhận được:
      // [
      //   {
      //     _id: "1",
      //     content: "Bình luận mới 1",
      //     reactionCounts: { like: 2 },
      //     totalReactions: 2,
      //     replies: [
      //       {
      //         _id: "2",
      //         content: "Trả lời mới 2",
      //         reactionCounts: { like: 5 },
      //         totalReactions: 5,
      //         replies: [],
      //       },
      //     ],
      //   },
      // ]
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
