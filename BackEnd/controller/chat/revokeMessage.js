const Message = require("../../model/Message.Model");
const Conversation = require("../../model/Conversation.Model");
const { getIO, getOnlineUsers } = require("../../config/socker");

exports.revokeMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    }

    if (message.senderId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only revoke your own messages",
      });
    }

    message.isrevoked = true;
    await message.save();

    const conversation = await Conversation.findById(message.conversationId);
    if (conversation) {
      const receiverIds = conversation.participants.filter(
        (p) => p.toString() !== userId.toString(),
      );

      const io = getIO();
      const onlineUsers = getOnlineUsers();
      // This code sends a "messageRevoked" event to ther other users in the conversation (except the sender) to notify them that the message has been revoked.
      receiverIds.forEach((receiverId) => {
        const receiverSocketId = onlineUsers[receiverId.toString()];
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("messageRevoked", {
            messageId: messageId,
            conversationId: message.conversationId,
          });
        }
      });
    }

    res.status(200).json({ success: true, message });
  } catch (err) {
    console.error("Error revoking message:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
