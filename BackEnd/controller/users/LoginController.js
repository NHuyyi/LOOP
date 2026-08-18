const bcrypt = require("bcrypt");
const UserModel = require("../../model/User.Model");
const jwt = require("jsonwebtoken");
const { completeTaskForUser } = require("../../utils/streakHelper");

const generateOTP = require("../../utils/generateOTP");
const sendEmail = require("../../utils/sendEmail");
exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Vui lòng điền đầy đủ các thông tin",
        success: false,
      });
    }

    const user = await UserModel.findOne({ email }).populate(
      "friends",
      "name avatar"
    ).populate("profile");


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
    // nếu tài khoản bật 2fa
    if (user.twoFactorEnabled) {
      const otp = generateOTP();
      user.otp = otp;
      user.otptype = "2fa"; // Đánh dấu loại OTP là 2fa
      user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
      await user.save();

      await sendEmail.sendEmail(
        user.email,
        "Mã xác thực 2 bước (2FA)",
        `Mã OTP đăng nhập của bạn là: ${otp}. Mã có hiệu lực trong 5 phút.`
      );

      return res.status(200).json({
        message: "Mã bảo mật đã được gửi đến email của bạn.",
        success: true,
        requires2FA: true, // Cờ báo cho FE biết cần chuyển qua trang nhập OTP
        email: user.email
      });
    }

    // Nếu đã xác minh thì tạo token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Task 4: Đăng nhập hôm nay (10 điểm)
    completeTaskForUser(user._id, 4).catch(() => { });

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
