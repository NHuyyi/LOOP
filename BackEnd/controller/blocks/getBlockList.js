const Block = require("../../model/Block.Model");
const Conversation = require("../../model/Conversation.Model");

exports.getBlockList = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Lấy danh sách ID user do MÌNH chặn
    const blocks = await Block.find({ blocker: userId });
    const blockedUserIds = blocks.map((b) => b.blocked);

    if (blockedUserIds.length === 0) {
      return res.status(200).json({ success: true, conversations: [] });
    }

    // 2. Lấy các conversation chứa người bị chặn này
    const conversations = await Conversation.find({
      participants: {
        $all: [userId],
        $in: blockedUserIds, // Cuộc trò chuyện bắt buộc phải chứa người mình đã chặn
      },
      deleteBy: { $ne: userId },
    })
      .populate("participants", "name avatar")
      .sort({ updatedAt: -1 });

    return res.status(200).json({ success: true, conversations });
  } catch (err) {
    console.error("Lỗi getBlockedConversations:", err);
    return res.status(500).json({ message: "Lỗi server", success: false });
  }
};
