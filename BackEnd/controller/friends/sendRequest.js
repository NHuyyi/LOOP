const User = require("../../model/User.Model");
const { getIO, getOnlineUsers } = require("../../config/socker");

// Gửi lời mời kết bạn
exports.sendRequest = async (req, res) => {
  try {
    const { senderId, receivedId } = req.body;

    // Kiểm tra nếu người gửi và người nhận là cùng một người
    if (senderId === receivedId) {
      return res.status(400).json({
        message: "Không thể gửi lời mời kết bạn cho chính mình",
        success: false,
      });
    }

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receivedId);

    // kiểm tra nếu người nhận không tồn tại
    if (!receiver) {
      return res
        .status(404)
        .json({ message: "Người dùng không tồn tại", success: false });
    }

    // Kiểm tra nếu đã là bạn bè
    if (sender.friends.includes(receivedId)) {
      return res.status(400).json({ message: "Đã là bạn bè", success: false });
    }

    // Kiểm tra nếu đã gửi lời mời kết bạn
    if (sender.sentRequests.some((req) => req.to.toString() === receivedId)) {
      return res
        .status(400)
        .json({ message: "Đã gửi lời mời kết bạn", success: false });
    }

    sender.sentRequests.push({ to: receivedId });
    receiver.friendRequests.push({ from: senderId });

    await sender.save();
    await receiver.save();

    // emit socket cho receiver nếu online
    const io = getIO();
    const onlineUsers = getOnlineUsers();
    if (onlineUsers[receivedId]) {
      io.to(onlineUsers[receivedId]).emit("friendRequestReceived", {
        by: senderId,
      });
    }

    return res
      .status(200)
      .json({ message: "Gửi lời mời kết bạn thành công", success: true });
  } catch (error) {
    console.error("Lỗi gửi lời mời kết bạn", error);
    return res
      .status(500)
      .json({ message: "Lỗi kết nối server", success: false });
  }
};
