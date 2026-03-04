const mongoose = require("mongoose");
// thông tin cuộc tro chuyện giữa 2 người dùng, có thể mở rộng để thêm nhiều người dùng hơn trong tương lai
const ConversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // lưu id của tin nhắn cuối cùng để dễ dàng truy xuất khi cần
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Conversation", ConversationSchema);
