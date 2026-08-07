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
    deleteBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },

    mutedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    restrictedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // ── Streak nhắn tin ───────────────────────────────────────
    // Số ngày liên tiếp CẢ 2 NGƯỜI đã nhắn tin cho nhau
    streak: { type: Number, default: 0 },
    // Ngày cuối cùng streak được cộng điểm (để biết hôm qua có hoàn thành chuỗi không)
    streakLastIncrementedDate: { type: Date, default: null },
    // Ngày hiện tại đang theo dõi để cộng chuỗi
    currentTrackingDate: { type: Date, default: null },
    // Danh sách những người đã nhắn tin trong ngày currentTrackingDate
    participantsChattedToday: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],
    // Ngày cuối cùng có tin nhắn được gửi (của bất kỳ ai)
    lastMessageDate: { type: Date, default: null },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Conversation", ConversationSchema);
