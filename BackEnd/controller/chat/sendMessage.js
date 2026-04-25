const Conversation = require("../../model/Conversation.Model");
const Message = require("../../model/Message.Model");
const { getIO, getOnlineUsers } = require("../../config/socker");

// API gửi tin nhắn trong một cuộc trò chuyện

exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id; // ID người gửi được lấy từ token
    const { receiverId, text, replyTo, isForwarded, messageType, imageUrl } = req.body;

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
      text: text || "", // ĐÃ SỬA: Nếu text bị undefined thì gán chuỗi rỗng
      messageType: messageType || "text",
      imageUrl: imageUrl || null,
      status: initialStatus,
      replyTo: replyTo || null, // Nếu không có tin nhắn trả lời, để null
      isForwarded: isForwarded || false, // Mặc định là false nếu không được cung cấp
    });

    // câp nhật trường lastMessage trong Conversation để lưu trữ tin nhắn mới nhất
    conversation.lastMessage = message._id;
    await conversation.save();

    //socket.io sẽ lắng nghe sự kiện "newMessage" và gửi tin nhắn mới đến người nhận
    const io = getIO();
    const populatedMessage = await message.populate([
      {
        path: "senderId",
        select: "name avatar",
      },
      {
        path: "replyTo",
        select: "text senderId",
        populate: {
          path: "senderId",
          select: "name avatar", // Lấy tên và avatar của người gửi tin nhắn bị reply
        },
      },
    ]);
    if (onlineUsers[receiverId]) {
      // Nhớ populate thêm phần replyTo để hiển thị nội dung tin bị reply

      io.to(onlineUsers[receiverId]).emit("newMessage", {
        conversationId: conversation._id,
        message: populatedMessage,
      });
    }
    // This emit is used to update the last message in the conversation list for the sender
    if (onlineUsers[senderId]) {
      io.to(onlineUsers[senderId]).emit("updateLastMessage", {
        conversationId: conversation._id,
        message: populatedMessage,
      });
    }

    return res.status(200).json({ success: true, message: populatedMessage });
  } catch (err) {
    console.error("Lỗi sendMessage:", err);
    return res.status(500).json({ message: "Lỗi server", success: false });
  }
};
