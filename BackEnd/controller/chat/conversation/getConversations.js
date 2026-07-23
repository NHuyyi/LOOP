// Đường dẫn: BackEnd/controller/chat/conversation/getConversations.js
const Conversation = require("../../../model/Conversation.Model");
const Block = require("../../../model/Block.Model");

exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. CHỈ LẤY DANH SÁCH MÀ CHÍNH USER NÀY LÀ NGƯỜI ĐI CHẶN (Blocker)
    const blocks = await Block.find({ blocker: userId });

    // 2. LẤY MẢNG ID CỦA NGƯỜI BỊ CHẶN
    const blockedUserIds = blocks.map((b) => b.blocked);

    // 3. TÌM CUỘC TRÒ CHUYỆN VÀ CHỈ LOẠI TRỪ NHỮNG NGƯỜI MÌNH ĐÃ CHẶN
    const conversations = await Conversation.find({
      participants: {
        $all: [userId], // Bắt buộc phải có mình
        $nin: blockedUserIds, // KHÔNG chứa ID những người mà mình đã chặn
      },
      deleteBy: { $ne: userId },
      restrictedBy: { $ne: userId },
    })
      .populate("participants", "name avatar friendCode username")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      conversations,
    });
  } catch (err) {
    console.error("Lỗi getConversations:", err);
    return res.status(500).json({ message: "Lỗi server", success: false });
  }
};
