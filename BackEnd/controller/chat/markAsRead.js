const Message = require("../../model/Message.Model");

exports.markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    // tìm và cập nhật tất cả tin nhắn trong cuộc trò chuyện này
    // điều kiện: người gửi không phải là mình  ($ne: userId) và isRead đang là false
    await Message.updateMany(
      {
        conversationId: conversationId,
        senderId: { $ne: userId },
        isRead: false,
      },
      { $set: { isRead: true } },
    );

    return res
      .status(200)
      .json({ success: true, message: "Đã cập nhật trạng thái đọc" });
  } catch (err) {
    console.error("Lỗi markAsRead:", err);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
