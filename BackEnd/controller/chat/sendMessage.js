const Conversation = require("../../model/Conversation.Model");
const Message = require("../../model/Message.Model");
const Block = require("../../model/Block.Model");
const { getIO, getOnlineUsers } = require("../../config/socker");
const { completeTaskForUser } = require("../../utils/streakHelper");

// ── Tính streak nhắn tin cho 1 conversation ──────────────────
const updateConversationStreak = async (conversation, senderId) => {
  const now   = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let trackingDate = conversation.currentTrackingDate
    ? new Date(
        conversation.currentTrackingDate.getFullYear(),
        conversation.currentTrackingDate.getMonth(),
        conversation.currentTrackingDate.getDate()
      )
    : null;

  let lastIncDate = conversation.streakLastIncrementedDate
    ? new Date(
        conversation.streakLastIncrementedDate.getFullYear(),
        conversation.streakLastIncrementedDate.getMonth(),
        conversation.streakLastIncrementedDate.getDate()
      )
    : null;

  // Nếu qua ngày mới
  if (!trackingDate || trackingDate < today) {
    // Kiểm tra xem streak có bị đứt không (hôm qua chưa hoàn thành chuỗi)
    if (lastIncDate) {
      const diffDays = Math.round((today - lastIncDate) / (1000 * 60 * 60 * 24));
      if (diffDays > 1) {
        // Hôm qua không tăng điểm chuỗi -> Streak bị đứt
        conversation.streak = 0;
      }
    } else {
      // Chưa từng tăng streak
      conversation.streak = 0;
    }

    // Reset bộ đếm cho ngày hôm nay
    conversation.currentTrackingDate = today;
    conversation.participantsChattedToday = [senderId];
  } else {
    // Nếu vẫn trong cùng một ngày
    if (!conversation.participantsChattedToday.includes(senderId)) {
      conversation.participantsChattedToday.push(senderId);
    }
  }

  // Kiểm tra xem cả 2 đã nhắn tin chưa và hôm nay chưa cộng streak
  if (
    conversation.participantsChattedToday.length >= 2 &&
    (!lastIncDate || lastIncDate < today)
  ) {
    conversation.streak = (conversation.streak || 0) + 1;
    conversation.streakLastIncrementedDate = today;
  }

  conversation.lastMessageDate = now;
  return conversation;
};


// API gửi tin nhắn trong một cuộc trò chuyện

exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id; // ID người gửi được lấy từ token
    const { receiverId, text, replyTo, isForwarded, messageType, imageUrl } =
      req.body;

    // tìm xem 2 người này đã có cuộc trò chuyện chưa
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    // kiểm tra xem cuộc trò chuyện có bị chặn không
    const blockRelation = await Block.findOne({
      $or: [
        { blocker: senderId, blocked: receiverId },
        { blocker: receiverId, blocked: senderId },
      ],
    });

    if (blockRelation) {
      return res.status(403).json({
        success: false,
        message:
          String(blockRelation.blocker) === String(senderId)
            ? "Bạn đã block người này"
            : "Bạn bị block bởi người này",
      });
    }

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
    conversation.deleteBy = []; // Reset deleteBy khi có tin nhắn mới

    // ── Cập nhật streak nhắn tin ──────────────────────────────
    await updateConversationStreak(conversation, senderId);
    await conversation.save();

    // ── Auto-complete nhiệm vụ ────────────────────────────────
    // Task 1: Nhắn tin cho 1 người bạn (20 điểm)
    completeTaskForUser(senderId, 1).catch(() => {});
    // Task 6: Nhắn tin 7 ngày liên tiếp (200 điểm) — nếu streak >= 7
    if ((conversation.streak || 0) >= 7) {
      completeTaskForUser(senderId, 6).catch(() => {});
    }
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

    const isRestricted =
      conversation.restrictedBy &&
      conversation.restrictedBy.includes(receiverId);

    if (onlineUsers[receiverId]) {
      // Nhớ populate thêm phần replyTo để hiển thị nội dung tin bị reply

      io.to(onlineUsers[receiverId]).emit("newMessage", {
        conversationId: conversation._id,
        message: populatedMessage,
        isRestricted: isRestricted,
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
