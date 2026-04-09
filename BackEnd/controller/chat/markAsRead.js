const Message = require("../../model/Message.Model");
const Conversation = require("../../model/Conversation.Model");
const { getIO, getOnlineUsers } = require("../../config/socker");

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
        status: { $in: ["sent", "delivered"] },
      },
      { $set: { status: "read" } },
    );

    // Tìm cuộc trò chuyện để lấy ra ID của đối tác chat (THIẾU ĐOẠN NÀY)
    const conversation = await Conversation.findById(conversationId);

    if (conversation) {
      // Lấy ra ID của người kia (lọc bỏ ID của chính mình)
      const receiverIds = conversation.participants.filter(
        (p) => p.toString() !== userId.toString(),
      );

      // Bắn thông báo qua socket
      const io = getIO();
      const onlineUsers = getOnlineUsers();

      // Phát sự kiện đến tất cả mọi người (hoặc tìm đúng socketId của đối tác chat để bắn)
      // 3. Gửi socket riêng (private) cho người kia (nếu họ đang online)
      receiverIds.forEach((receiverId) => {
        // Lấy socket.id của người đó từ mảng onlineUsers
        const receiverSocketId = onlineUsers[receiverId.toString()];

        if (receiverSocketId) {
          // Gửi riêng cho họ sự kiện "messageRead"
          io.to(receiverSocketId).emit("messageRead", {
            conversationId: conversationId,
            readerId: userId, // ID của bạn (người vừa xem)
          });
        }
      });
    }
    return res
      .status(200)
      .json({ success: true, message: "Đã cập nhật trạng thái đọc" });
  } catch (err) {
    console.error("Lỗi markAsRead:", err);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
