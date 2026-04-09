const { populate } = require("../../model/Conversation.Model");
const Message = require("../../model/Message.Model");

// API lấy nội dung tin nhắn của một cuộc trò chuyện với phân trang
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const messages = await Message.find({ conversationId })
      .populate("senderId", "name avatar")
      .populate("reactions.userId", "name avatar")
      .populate({
        path: "replyTo",
        select: "text senderId",
        populate: {
          path: "senderId",
          select: "name avatar", // Lấy tên (và avatar) của người đã gửi tin nhắn cũ đó
        },
      }) // Populate thêm thông tin người gửi của tin nhắn bị reply
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // tuy nhiên mặc dù ta lấy mãng tin nhắn theo thứ tự mới nhất trước nhưng khi trả về client thì ta sẽ đảo ngược lại để hiển thị tin nhắn cũ trước
    const formattedMessages = messages.reverse();

    return res.status(200).json({
      success: true,
      messages: formattedMessages,
      hasMore: messages.length === limit,
    });
  } catch (err) {
    console.error("Lỗi getMessages:", err);
    return res.status(500).json({ message: "Lỗi server", success: false });
  }
};
