// controller/user/getUserById.js
const User = require("../../model/User.Model");

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.body;

    // populate friends nếu muốn lấy danh sách chi tiết
    const user = await User.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng" });
    }

    return res.json({ success: true, user });
  } catch (error) {
    console.error("lỗi lấy thông tin người dùng:", error);
    return res.status(500).json({ success: false, message: "Server lỗi" });
  }
};
