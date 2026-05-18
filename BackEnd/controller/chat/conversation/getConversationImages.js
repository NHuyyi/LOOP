const Message = require("../../../model/Message.Model");

exports.getConversationImages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const images = await Message.find({
      conversationId,
      imageUrl: { $ne: null }, // Lọc các tin nhắn có imageUrl khác null
      isrevoked: false, // Lọc các tin nhắn chưa bị thu hồi
    })
      .sort({ createdAt: -1 }) // Sắp xếp theo thời gian tạo, mới nhất trước
      .select("imageUrl"); // Chỉ lấy trường imageUrl

    res.status(200).json({ success: true, images });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Lỗi khi lấy ảnh từ cuộc trò chuyện",
        error: err.message,
      });
  }
};
