// controller/friends/checkStatus.js
const User = require("../../model/User.Model");

exports.checkFriendStatus = async (req, res) => {
  try {
    const { userId, targetId } = req.body;

    if (userId === targetId) {
      return res.status(400).json({
        message: "Không thể kiểm tra chính mình",
        success: false,
      });
    }

    const user = await User.findById(userId);
    const target = await User.findById(targetId);

    if (!target) {
      return res
        .status(404)
        .json({ message: "Người dùng không tồn tại", success: false });
    }

    // 1. Đã là bạn bè
    if (user.friends.includes(targetId)) {
      return res.json({ status: "friends" });
    }

    // 2. Đã gửi lời mời kết bạn
    if (user.sentRequests.some((req) => req.to.toString() === targetId)) {
      return res.json({ status: "requestSent" });
    }

    // 3. Đã nhận lời mời từ target
    if (user.friendRequests.some((req) => req.from.toString() === targetId)) {
      return res.json({ status: "requestReceived" });
    }

    // 4. Chưa có quan hệ
    return res.json({ status: "none" });
  } catch (error) {
    console.error("Lỗi checkFriendStatus", error);
    return res.status(500).json({ message: "Lỗi server", success: false });
  }
};
