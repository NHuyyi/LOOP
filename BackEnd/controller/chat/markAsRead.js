const Message = require("../../model/Message.Model");
const Conversation = require("../../model/Conversation.Model");
const { getIO, getOnlineUsers } = require("../../config/socker");

exports.markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    // 1. Lưu lại kết quả của lệnh update
    const updateResult = await Message.updateMany(
      {
        conversationId: conversationId,
        senderId: { $ne: userId },
        status: { $in: ["sent", "delivered"] },
      },
      { $set: { status: "read" } },
    );

    // 2. CHỈ bắn socket nếu thực sự có tin nhắn được chuyển sang "read"
    if (updateResult.modifiedCount > 0) {
      const conversation = await Conversation.findById(conversationId);
      if (conversation) {
        const receiverIds = conversation.participants.filter(
          (p) => p.toString() !== userId.toString(),
        );

        const io = getIO();
        const onlineUsers = getOnlineUsers();

        receiverIds.forEach((receiverId) => {
          const receiverSocketId = onlineUsers[receiverId.toString()];
          if (receiverSocketId) {
            io.to(receiverSocketId).emit("messageRead", {
              conversationId: conversationId,
              readerId: userId,
            });
          }
        });
      }
    }

    return res
      .status(200)
      .json({ success: true, message: "Cập nhật trạng thái thành công" });
  } catch (err) {
    console.error("Lỗi markAsRead:", err);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};