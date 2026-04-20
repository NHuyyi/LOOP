const Message = require("../../model/Message.Model");

exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    // This code checks if the user has already marked the message as deleted. If not, it adds the user's ID to the deleteby array and saves the message.
    if (!message.deleteby.includes(userId)) {
      message.deleteby.push(userId);
      await message.save();
    }

    res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
