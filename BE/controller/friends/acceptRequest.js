const User = require("../../model/User.Model");
const { getIO, getOnlineUsers } = require("../../config/socker");
// chấp nhận lời mời kết bạn
exports.acceptRequest = async (req, res) => {
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

    // kiểm tra xem user có lời mời từ sender không
    const hasRequest = user.friendRequests.some(
      (r) => r.from.toString() === senderId
    );

    if (!hasRequest) {
      return res.status(400).json({
        message: "Không tồn tại lời mời kết bạn từ người này",
        success: false,
      });
    }

    // kiểm tra xem sender có thực sự gửi request cho user không
    const hasSent = sender.sentRequests.some((r) => r.to.toString() === userId);

    if (!hasSent) {
      return res.status(400).json({
        message: "Người này không gửi lời mời kết bạn",
        success: false,
      });
    }

    // xóa sender khỏi danh sách nhận lời mời kết bạn của user
    user.friendRequests = user.friendRequests.filter(
      (r) => r.from.toString() !== senderId
    );
    // xóa user khỏi danh sách gửi lời mời của sender
    sender.sentRequests = sender.sentRequests.filter(
      (r) => r.to.toString() !== userId
    );
    // thêm nhau vào danh sách bạn bè
    if (!user.friends.includes(senderId)) user.friends.push(senderId);
    if (!sender.friends.includes(userId)) sender.friends.push(userId);

    await user.save();
    await sender.save();

    const io = getIO();
    const onlineUsers = getOnlineUsers();
    if (onlineUsers[senderId]) {
      io.to(onlineUsers[senderId]).emit("friendRequestAccepted", {
        by: userId,
      });
    }

    return res
      .status(200)
      .json({ message: "kết bạn thành công", success: true });
  } catch (error) {
    console.error("Lỗi kết bạn", error);
    return res
      .status(500)
      .json({ message: "Lỗi kết nối server", success: false });
  }
};
