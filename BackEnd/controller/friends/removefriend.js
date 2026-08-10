const User = require("../../model/User.Model");
const Conversation = require("../../model/Conversation.Model");
const Message = require("../../model/Message.Model");
const { getIO, getOnlineUsers } = require("../../config/socker");

// chấp nhận lời mời kết bạn
exports.removeRequest = async (req, res) => {
  try {
    const { userId, receivedId } = req.body;

    const user = await User.findById(userId);
    const received = await User.findById(receivedId);

    // kiểm tra nếu người nhận không tồn tại
    if (!received) {
      return res
        .status(404)
        .json({ message: "Người dùng không tồn tại", success: false });
    }

    // xóa received  khỏi danh sách bạn của user
    user.friends = user.friends.filter((r) => r.toString() !== receivedId);
    // xóa user khỏi danh sách bạn của received
    received.friends = received.friends.filter((r) => r.toString() !== userId);

    await user.save();
    await received.save();

    const conversation = await Conversation.findOne({
      participants: { $all: [userId, receivedId] },
    });

    let deletedConversationId = null;
    if (conversation) {
      deletedConversationId = conversation._id;
      await Conversation.findByIdAndUpdate(conversation._id, {
        $addToSet: { deleteBy: { $each: [userId, receivedId] } },
      });
      const messages = await Message.find({ conversationId: conversation._id });
      const updatePromises = messages.map(async (msg) => {
        let isModified = false;

        const isUserDeleted = msg.deleteby.some(id => id.toString() === userId.toString());
        const isReceivedDeleted = msg.deleteby.some(id => id.toString() === receivedId.toString());

        if (!isUserDeleted) {
          msg.deleteby.push(userId);
          isModified = true;
        }
        if (!isReceivedDeleted) {
          msg.deleteby.push(receivedId);
          isModified = true;
        }

        if (isModified) return msg.save();
      });
      await Promise.all(updatePromises.filter(Boolean));
    }

    const io = getIO();
    const onlineUsers = getOnlineUsers();
    // Nếu friend đang online, gửi sự kiện
    if (onlineUsers[receivedId]) {
      io.to(onlineUsers[receivedId]).emit("friendRemoved", { by: userId, conversationId: deletedConversationId });
    }
    return res
      .status(200)
      .json({ message: "Xóa bạn thành công", success: true });
  } catch (error) {
    console.error("Lỗi xóa bạn", error);
    return res
      .status(500)
      .json({ message: "Lỗi kết nối server", success: false });
  }
};
