const User = require("../../model/User.Model");

// chấp nhận lời mời kết bạn
exports.findnewfriend = async (req, res) => {
  try {
    const { friendCode, userId } = req.body;
    if (!friendCode || !userId) {
      return res
        .status(400)
        .json({ message: "Thiếu thiếu thông tin", success: false });
    }
    const user = await User.findById(userId);
    if (friendCode === user.friendCode) {
      return res
        .status(400)
        .json({ message: "Không thể tìm chính bạn", success: false });
    }
    const newfriend = await User.findOne({ friendCode });
    if (!newfriend) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy người dùng", success: false });
    }
    return res.status(200).json({ newfriend, success: true });
  } catch (error) {
    console.error("Lỗi kết bạn", error);
    return res
      .status(500)
      .json({ message: "Lỗi kết nối server", success: false });
  }
};
