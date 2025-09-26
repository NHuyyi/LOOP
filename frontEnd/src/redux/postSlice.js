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
      state.posts.unshift(action.payload); // thêm bài mới vào đầu
    },
    updatePost: (state, action) => {
      const updatedPost = action.payload; // object post trả về từ BE
      const index = state.posts.findIndex((p) => p._id === updatedPost._id);
      if (index !== -1) {
        state.posts[index] = {
          ...state.posts[index],
          ...updatedPost, // merge dữ liệu mới
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
