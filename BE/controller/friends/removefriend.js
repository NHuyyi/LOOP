const User = require("../../model/User.Model");
const { getIO, getOnlineUsers } = require("../../config/socker");

// chấp nhận lời mời kết bạn
exports.removeRequest = async (req, res) => {
  try {
    const { userId, receivedId } = req.body;

    const user = await User.findById(userId);
    const received = await User.findById(receivedId);

    // kiểm tra nếu người nhận không tồn tại
    if (!received) {
      console.log("thử", userId);
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

    const io = getIO();
    const onlineUsers = getOnlineUsers();
    // Nếu friend đang online, gửi sự kiện
    if (onlineUsers[receivedId]) {
      io.to(onlineUsers[receivedId]).emit("friendRemoved", { by: userId });
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
