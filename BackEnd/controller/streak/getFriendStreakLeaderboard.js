const Conversation = require("../../model/Conversation.Model");
const User = require("../../model/User.Model");

/**
 * GET /api/streak/leaderboard/friends?limit=50
 * Top N bạn bè của user hiện tại có chuỗi nhắn tin cao nhất
 */
exports.getFriendStreakLeaderboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit  = Math.min(parseInt(req.query.limit) || 50, 100);

    // Lấy danh sách bạn bè
    const me = await User.findById(userId).select("friends");
    if (!me) return res.status(404).json({ success: false, message: "User không tồn tại" });

    const friendIds = me.friends || [];

    // Lấy tất cả conversation giữa mình và từng người bạn, lấy streak cao nhất mỗi người
    const conversations = await Conversation.find({
      participants: { $in: [userId] },
      "participants.1": { $exists: true }, // ít nhất 2 người
    })
      .select("participants streak lastMessageDate")
      .populate("participants", "name avatar");

    // Lọc conversation có bạn bè, lấy 1 conv/bạn, sort theo streak
    const friendMap = new Map();

    for (const conv of conversations) {
      const other = conv.participants.find(
        (p) => String(p._id) !== String(userId)
      );
      if (!other) continue;

      const isFriend = friendIds.some(
        (fId) => String(fId) === String(other._id)
      );
      if (!isFriend) continue;

      const key = String(other._id);
      const existing = friendMap.get(key);
      if (!existing || (conv.streak || 0) > existing.streak) {
        friendMap.set(key, {
          userId: other._id,
          name: other.name,
          avatar: other.avatar,
          streak: conv.streak || 0,
          lastMessageDate: conv.lastMessageDate || conv.updatedAt,
        });
      }
    }

    // Sắp xếp và giới hạn
    const sorted = [...friendMap.values()]
      .sort((a, b) => b.streak - a.streak)
      .slice(0, limit)
      .map((item, idx) => ({ rank: idx + 1, ...item }));

    return res.json({ success: true, data: sorted });
  } catch (err) {
    console.error("getFriendStreakLeaderboard error:", err);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
