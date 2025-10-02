// src/redux/postSlice.js
import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [], // danh sách post cơ bản
  },
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    addPost: (state, action) => {
      if (Array.isArray(state.posts)) {
        state.posts.unshift(action.payload); // thêm bài mới lên đầu
      } else {
        state.posts = [action.payload];
      }
    },
    updatePost: (state, action) => {
      const updatedPost = action.payload;
      const index = state.posts.findIndex((p) => p._id === updatedPost._id);
      if (index !== -1) {
        state.posts[index] = {
          ...state.posts[index],
          ...updatedPost,
          author: updatedPost.author || state.posts[index].author, // giữ lại tác giả cũ nếu BE không trả về
        };
      }
    },

    DeletePosts: (state, action) => {
      const postId = action.payload;
      state.posts = state.posts.filter((p) => p._id !== postId);
    },
  },
});

export const { setPosts, addPost, updatePost, DeletePosts } = postSlice.actions;
export default postSlice.reducer;
