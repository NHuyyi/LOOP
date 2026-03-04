const Conversation = require("../../model/Conversation.Model");

// api lấy danh sách cuộc trò chuyện của người dùng, bao gồm thông tin người chat cùng và tin nhắn cuối cùng
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
      participants: { $in: [userId] },
    })
      .populate("participants", "name avatar friendCode username") // Lấy thông tin người chat cùng
      .populate("lastMessage") // Lấy nội dung tin nhắn cuối cùng
      .sort({ updatedAt: -1 }); // Sắp xếp cuộc trò chuyện mới nhất lên đầu

    return res.status(200).json({
      success: true,
      conversations,
    });
  } catch (err) {
    console.error("Lỗi getConversations:", error);
    return res.status(500).json({ message: "Lỗi server", success: false });
  }
};
