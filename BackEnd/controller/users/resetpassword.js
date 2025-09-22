const UserModel = require("../../model/User.Model");
const bcrypt = require("bcrypt");

exports.resetpassword = async (req, res) => {
  try {
    const { email, password, comfimPassword } = req.body;

    // kiểm tra xem thông tin đã được điền đầy đủ chưa
    if (!email || !password || !comfimPassword) {
      return res.status(400).json({
        message: "vui lòng điền đầy đủ các thông tin",
        success: false,
      });
    }

    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      return res
        .status(400)
        .json({ message: "Người dùng không tồn tại", success: false });
    }

    // kiểm tra xem mật khẩu có khớp không
    if (password !== comfimPassword) {
      return res
        .status(400)
        .json({ message: "Mật khẩu không khớp", success: false });
    }

    // mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.findOneAndUpdate(
      { email },
      {
        password: hashedPassword,
      },
      { new: true } // trả về document sau khi update
    );
    return res.status(200).json({
      message: "Đổi thành công!",
      user: user,
      success: true,
    });
  } catch (error) {
    console.error("Lỗi thây đổi mật khẩu", error);
    return res
      .status(500)
      .json({ message: "Lỗi kết nối server", success: false });
  }
};
