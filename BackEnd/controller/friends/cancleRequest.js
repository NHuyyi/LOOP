const User = require("../../model/User.Model");
const { getIO, getOnlineUsers } = require("../../config/socker");

// từ chối lời mời kết bạn
exports.cacleRequest = async (req, res) => {
  try {
    const { userId, receivedId } = req.body;

    const user = await User.findById(userId);
    const received = await User.findById(receivedId);

    // kiểm tra nếu người gửi không tồn tại
    if (!received) {
      return res
        .status(404)
        .json({ message: "Người dùng không tồn tại", success: false });
    }

    // xóa received khỏi danh sách nhận lời mời kết bạn của user
    user.sentRequests = user.sentRequests.filter(
      (r) => r.to.toString() !== receivedId
    );
    // xóa user khỏi danh sách gửi lời mời của received
    received.friendRequests = received.friendRequests.filter(
      (r) => r.from.toString() !== userId
    );

    await user.save();
    await received.save();
    // emit socket cho receiver nếu online
    const io = getIO();
    const onlineUsers = getOnlineUsers();
    if (onlineUsers[receivedId]) {
      io.to(onlineUsers[receivedId]).emit("friendRequestCancle", {
        by: userId,
      });
    }

    return res
      .status(200)
      .json({ message: "Hủy lời mời thành công", success: true });
  } catch (error) {
    console.error("Lỗi hủy lời mời", error);
    return res
      .status(500)
      .json({ message: "Lỗi kết nối server", success: false });
  }
};
