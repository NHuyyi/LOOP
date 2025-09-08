// models/Post.js
const mongoose = require("mongoose");

const Post = new mongoose.Schema(
  {
    imageUrl: {
      type: String, // link ảnh của bài đăng
      required: true,
    },
    content: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId, // người đăng bài
      ref: "User",
      required: true,
    },
    reactions: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        type: {
          type: String,
          enum: ["like", "love", "haha", "wow", "sad", "angry"], // reaction có sẵn
          required: true,
        },
      },
    ],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true } // tự động thêm createdAt và updatedAt
);

const PostModel = mongoose.model("Post", Post);
module.exports = PostModel;
