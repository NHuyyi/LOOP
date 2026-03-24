const Message = require("../../model/Message.Model");
const Conversation = require("../../model/Conversation.Model");
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
      (reaction) => reaction.userId.toString() === userId.toString(),
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
    const populatedMessage = await message.populate(
      "reactions.userId",
      "name avatar",
    );

    const conversation = await Conversation.findById(message.conversationId);
    // gửi socket
    if (conversation && conversation.participants) {
      const io = getIO();
      const onlineUsers = getOnlineUsers();

      conversation.participants.forEach((participantId) => {
        // Chỉ gửi socket cho đối phương, KHÔNG gửi ngược lại cho người vừa bấm
        if (participantId.toString() !== userId.toString()) {
          const socketId = onlineUsers[participantId.toString()];
          if (socketId) {
            io.to(socketId).emit("UpdateReactionMessage", {
              messageId: message._id.toString(),
              reactions: populatedMessage.reactions,
              conversationId: message.conversationId.toString(),
            });
          }
        }
      });
    }

    return res
      .status(200)
      .json({ success: true, reactions: populatedMessage.reactions });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi server", success: false });
  }
};
