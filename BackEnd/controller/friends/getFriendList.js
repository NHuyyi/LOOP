const User = require("../../model/User.Model");

// lây danh sách bạn bè của người dùng
exports.getFriendList = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId)
      .populate("friends", "name  avatar friendCode")
      .populate("friendRequests.from", "name avatar friendCode")
      .populate("sentRequests.to", "name avatar friendCode");

    if (!user) {
      return res
        .status(404)
        .json({ message: "Người dùng không tồn tại", success: false });
    }

    return res.status(200).json({
      success: true,
      friend: user.friends,
      friendRequests: user.friendRequests,
      sentRequests: user.sentRequests,
    });
  } catch (error) {
    console.error("Lỗi lấy danh sách bạn bè", error);
    return res.status(500).json({ message: "Lỗi máy chủ", success: false });
  }
};
