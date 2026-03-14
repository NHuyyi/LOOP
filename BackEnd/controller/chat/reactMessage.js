const Message = require("../../model/Message.Model");
const { getIO, getOnlineUsers } = require("../../config/socker");

exports.reactMessage = async (req, res) => {
  try {
    const { messageId, type } = req.body;
    const userId = req.user.id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Tin nhắn không tồn tại" });
    }

    // tìm user đã react chưa
    const existingIndex = message.reactions.findIndex(
      (reaction) => reaction.userId.toString() === userId,
    );

    if (existingIndex !== -1) {
      if (message.reactions[existingIndex].type === type) {
        message.reactions.splice(existingIndex, 1);
      } else {
        message.reactions[existingIndex].type = type;
      }
    } else {
      message.reactions.push({ userId, type });
    }

    await message.save();

    // gửi socket
    const onlineUsers = getOnlineUsers();
    const io = getIO();

    io.emit("UpdateReactionMessage", {
      messageId,
      reactions: message.reactions,
      conversationId: message.conversationId,
    });

    return res
      .status(200)
      .json({ success: true, reactions: message.reactions });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi server", success: false });
  }
};
