const mongoose = require("mongoose");

const UserStreakSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // ── Điểm ──────────────────────────────────
    totalPoints: { type: Number, default: 0 },

    // ── Nhiệm vụ hàng ngày ────────────────────
    completedDailyTasks: { type: [Number], default: [] }, // [1,3,4]
    lastDailyReset: { type: Date, default: null },        // ngày reset nhiệm vụ ngày

    // ── Nhiệm vụ hàng tuần ────────────────────
    completedWeeklyTasks: { type: [Number], default: [] },
    lastWeeklyReset: { type: Date, default: null },       // ngày reset nhiệm vụ tuần

    // ── Đếm bài viết trong tuần (Task 8) ──────
    weeklyPostCount: { type: Number, default: 0 },

    // ── Đăng nhập ─────────────────────────────
    lastLoginDate: { type: Date, default: null },         // cho Task 4 (đăng nhập hôm nay)
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserStreak", UserStreakSchema);
