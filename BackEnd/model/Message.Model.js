const mongoose = require("mongoose");
// lưu nội dung chi tiết của tin nhắn

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"], // sent: đã gửi, delivered: đã nhận, read: đã xem, deleted: đã xóa
      default: "sent",
    },
    isdeleted: {
      type: Boolean,
      default: false,
    },
    reactions: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        type: {
          type: String,
          enum: ["like", "love", "haha", "wow", "sad", "angry"], // Bạn có thể tùy chỉnh danh sách này
          required: true,
        },
      },
    ],

    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null, // Nếu không phải là tin nhắn trả lời, để null
    },
  },
  { timestamps: true },
);
const MessageModel = mongoose.model("Message", MessageSchema);
module.exports = MessageModel;
