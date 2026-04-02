const Conversation = require("../../model/Conversation.Model");
const Message = require("../../model/Message.Model");
const { getIO, getOnlineUsers } = require("../../config/socker");

// API gửi tin nhắn trong một cuộc trò chuyện

exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id; // ID người gửi được lấy từ token
    const { receiverId, text, replyTo } = req.body;

    // tìm xem 2 người này đã có cuộc trò chuyện chưa
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    // nếu chưa có cuộc trò chuyện thì tạo mới
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }
    const onlineUsers = getOnlineUsers();
    const initialStatus = onlineUsers[receiverId] ? "delivered" : "sent";
    // tạo tin nhắn mới
    const message = await Message.create({
      conversationId: conversation._id,
      senderId,
      text,
      status: initialStatus,
      replyTo: replyTo || null, // Nếu không có tin nhắn trả lời, để null
    });

    // câp nhật trường lastMessage trong Conversation để lưu trữ tin nhắn mới nhất
    conversation.lastMessage = message._id;
    await conversation.save();

    //socket.io sẽ lắng nghe sự kiện "newMessage" và gửi tin nhắn mới đến người nhận
    const io = getIO();
    if (onlineUsers[receiverId]) {
      // Nhớ populate thêm phần replyTo để hiển thị nội dung tin bị reply
      const populatedMessage = await message
        .populate("senderId", "name avatar")
        .populate({
          path: "replyTo",
          select: "text senderId",
        });

      io.to(onlineUsers[receiverId]).emit("newMessage", {
        conversationId: conversation._id,
        message: populatedMessage,
      });
    }

    return res.status(200).json({ success: true, message });
  } catch (err) {
    console.error("Lỗi sendMessage:", err);
    return res.status(500).json({ message: "Lỗi server", success: false });
  }
};
