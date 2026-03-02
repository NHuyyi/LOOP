const User = require(`../../model/User.Model`);

// lấy danh sách bạn bè của người dùng với bộ lọc
exports.getFriendListFilter = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId).populate(
      "friends",
      "name avatar friendCode",
    );

    if (!user) {
      return res
        .status(404)
        .json({ message: "Người dùng không tồn tại", success: false });
    }

    // Lọc danh sách bạn bè 10 người chat gần nhất, nếu không đủ thì sẽ lấy danh sách bạn bè mới kết bạ  bỏ vào để đủ 10 người

    const recentFriends = [...user.friends].reverse().slice(0, 10);

    return res.status(200).json({
      success: true,
      friend: recentFriends,
    });
  } catch (error) {
    console.error("Lỗi lấy danh sách bạn bè", error);
    return res.status(500).json({ message: "Lỗi máy chủ", success: false });
  }
};
