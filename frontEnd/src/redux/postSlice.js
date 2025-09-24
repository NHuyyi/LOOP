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
      const { postId, content, image } = action.payload;
      const post = state.posts.find((p) => p._id === postId);
      if (post) {
        if (content !== undefined) post.content = content;
        if (image !== undefined) post.image = image;
        post.updatedAt = new Date().toISOString();
      }
    },
    deletePost: (state, action) => {
      const postId = action.payload;
      state.posts = state.posts.filter((p) => p._id !== postId);
    },
  },
});

export const { setPosts, addPost, updatePost, deletePost } = postSlice.actions;
export default postSlice.reducer;
