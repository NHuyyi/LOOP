const User = require("../../model/User.Model");
const { getIO, getOnlineUsers } = require("../../config/socker");

// từ chối lời mời kết bạn
exports.rejectRequest = async (req, res) => {
  try {
    const { userId, senderId } = req.body;

    const user = await User.findById(userId);
    const sender = await User.findById(senderId);

    // kiểm tra nếu người gửi không tồn tại
    if (!sender) {
      return res
        .status(404)
        .json({ message: "Người dùng không tồn tại", success: false });
    }

    // xóa sender khỏi danh sách nhận lời mời kết bạn của user
    user.friendRequests = user.friendRequests.filter(
      (r) => r.from.toString() !== senderId
    );
    // xóa user khỏi danh sách gửi lời mời của sender
    sender.sentRequests = sender.sentRequests.filter(
      (r) => r.to.toString() !== userId
    );

    await user.save();
    await sender.save();

    // emit socket cho receiver nếu online
    const io = getIO();
    const onlineUsers = getOnlineUsers();
    if (onlineUsers[senderId]) {
      io.to(onlineUsers[senderId]).emit("friendRequestReject", {
        by: senderId,
      });
    }

    return res
      .status(200)
      .json({ message: "Từ chối thành công", success: true });
  } catch (error) {
    console.error("Lỗi từ chối", error);
    return res
      .status(500)
      .json({ message: "Lỗi kết nối server", success: false });
  }
};
