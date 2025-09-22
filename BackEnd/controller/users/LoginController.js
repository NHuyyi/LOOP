const bcrypt = require("bcrypt");
const UserModel = require("../../model/User.Model");
const jwt = require("jsonwebtoken");

exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Vui lòng điền đầy đủ các thông tin",
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Người dùng không tồn tại",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Thông tin đăng nhập sai", success: false });
    }

    // ✅ Kiểm tra xác minh OTP
    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Tài khoản chưa xác minh, vui lòng xác thực OTP",
        user: { email: user.email, isVerified: user.isVerified },
      });
    }

    // Nếu đã xác minh thì tạo token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Đăng nhập thành công!",
      user: user,
      success: true,
      token: token,
    });
  } catch (error) {
    console.error("lỗi đăng nhập", error);
    return res.status(500).json({
      message: "Lỗi kết nối server",
      success: false,
    });
  }
};
