const Conversation = require("../../../model/Conversation.Model");
const Message = require("../../../model/Message.Model");

exports.deleteConversation = async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    const userId = req.user.id;

    await Conversation.findByIdAndUpdate(conversationId, {
      $addToSet: { deleteBy: userId }, // Dùng $addToSet để không bị thêm trùng lặp ID
    });
    // 1. Tìm TẤT CẢ tin nhắn của cuộc trò chuyện này
    const messages = await Message.find({ conversationId });

    // 2. Lặp qua từng tin nhắn và thêm ID vào mảng deleteby
    const updatePromises = messages.map(async (msg) => {
      // Kiểm tra xem user này đã xóa tin nhắn này chưa (tránh trùng lặp giống $addToSet)
      const isAlreadyDeleted = msg.deleteby.some(
        (id) => id.toString() === userId,
      );

      if (!isAlreadyDeleted) {
        msg.deleteby.push(userId);
        return msg.save();
      }
    });

    // 3. Chờ tất cả tin nhắn được lưu xong
    await Promise.all(updatePromises);
    return res
      .status(200)
      .json({ success: true, message: "xóa cuộc trò chuyện thành công" });
  } catch (error) {
    console.error("Lỗi deleteConversation:", error);
    return res.status(500).json({ message: "Lỗi server", success: false });
  }
};
