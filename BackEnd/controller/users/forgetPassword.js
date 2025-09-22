const UserModel = require("../../model/User.Model");
const generateOTP = require("../../utils/generateOTP");
const sendEmail = require("../../utils/sendEmail");

exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập email", success: false });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Email không tồn tại", success: false });
    }

    // tạo OTP mới
    const otp = generateOTP(); // ví dụ "123456"
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 phút

    const updatedUser = await UserModel.findOneAndUpdate(
      { email },
      {
        otp: otp,
        otptype: "reset",
        otpExpires: otpExpires,
      },
      { new: true } // trả về document sau khi update
    );
    await updatedUser.save();

    // gửi email OTP
    await sendEmail.sendEmail(
      email,
      "Khôi phục mật khẩu",
      `Mã OTP của bạn là: ${otp}. Mã này sẽ hết hạn sau 5 phút.`
    );

    return res.json({
      message: "OTP đã được gửi tới email của bạn",
      success: true,
    });
  } catch (error) {
    console.error("Lỗi forgotPassword:", error);
    return res.status(500).json({ message: "Lỗi server", success: false });
  }
};
