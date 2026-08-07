const UserStreak = require("../../model/UserStreak.Model");
const User = require("../../model/User.Model");

/**
 * GET /api/streak/leaderboard/points?limit=50
 * Top N người dùng có tổng điểm cao nhất (toàn hệ thống)
 */
exports.getPointsLeaderboard = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);

    const topStreaks = await UserStreak.find()
      .sort({ totalPoints: -1 })
      .limit(limit)
      .populate("userId", "name avatar");

    const leaderboard = topStreaks
      .filter((s) => s.userId) // loại bỏ user bị xóa
      .map((s, idx) => ({
        rank: idx + 1,
        userId: s.userId._id,
        name: s.userId.name,
        avatar: s.userId.avatar,
        points: s.totalPoints,
      }));

    return res.json({ success: true, data: leaderboard });
  } catch (err) {
    console.error("getPointsLeaderboard error:", err);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
