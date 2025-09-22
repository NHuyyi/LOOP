import { createSelector } from "@reduxjs/toolkit";

export const makeSelectCommentsByPostId = (postId) =>
  createSelector(
    (state) => state.comments,
    (comments) => {
      return Array.isArray(comments?.[postId]) ? comments[postId] : [];
    }
  );
