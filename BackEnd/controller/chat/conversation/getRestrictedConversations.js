const Conversation = require("../../../model/Conversation.Model");

exports.getRestrictedConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({
      participants: { $in: [userId] },
      restrictedBy: userId,
      deleteBy: { $ne: userId },
    })
      .populate("participants", "name avatar friendCode username")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      conversations,
    });
  } catch (err) {
    console.error("Lỗi getRestrictedConversations:", err);
    return res.status(500).json({ message: "Lỗi server", success: false });
  }
};
