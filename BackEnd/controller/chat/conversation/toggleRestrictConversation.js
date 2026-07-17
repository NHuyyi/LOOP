const Conversation = require("../../../model/Conversation.Model");

exports.toggleRestrictConversation = async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    const userId = req.user.id;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy cuộc trò chuyện",
      });
    }

    if (!conversation.participants.some((p) => p.toString() === userId)) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền hạn chế cuộc trò chuyện này",
      });
    }

    if (!conversation.restrictedBy) {
      conversation.restrictedBy = [];
    }

    // kiểm tra xem cuộc trò chuyện đã bị hạn chế chưa
    const isRestricted = conversation.restrictedBy.some(
      (id) => id.toString() === userId,
    );
    // nếu rồi thì xóa khỏi hạn chế nếu chưa thì thêm vào hạn chế
    if (isRestricted) {
      conversation.restrictedBy = conversation.restrictedBy.filter(
        (id) => id.toString() !== userId,
      );
    } else {
      conversation.restrictedBy.push(userId);
    }

    await conversation.save();

    const updatedConversation = await Conversation.findById(conversationId)
      .populate("participants", "name avatar friendCode username")
      .populate("lastMessage");

    return res.status(200).json({
      success: true,
      conversation: updatedConversation,
      isRestricted: !isRestricted,
    });
  } catch (err) {
    console.error("Lỗi toggleRestrictConversation:", err);
    return res.status(500).json({ message: "Lỗi server", success: false });
  }
};
