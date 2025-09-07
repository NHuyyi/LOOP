const generateOTP = require("../../utils/generateOTP");
const sendEmail = require("../../utils/sendEmail");
const UserModel = require("../../model/User.Model");

exports.resendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    // Kiểm tra xem email có được cung cấp không
    if (!email) {
      return res.status(400).json({ message: "Vui lòng cung cấp email" });
    }

    // Tìm người dùng theo email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Người dùng không tồn tại", success: false });
    }

    // Tạo OTP mới và thời gian hết hạn
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 phút

    // Cập nhật OTP và thời gian hết hạn cho người dùng
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Gửi email với OTP mới
    await sendEmail.sendEmail(
      email,
      "Gửi lại mã OTP",
      `Mã OTP mới của bạn là: ${otp}. Mã này sẽ hết hạn sau 5 phút và chỉ dùng 1 lần.`
    );

    return res.status(200).json({
      message: "OTP đã được gửi lại vào email của bạn",
      email: email,
      success: true,
    });
  } catch (error) {
    console.error("lỗi gửi lại OTP:", error);
    return res
      .status(500)
      .json({ message: "Lỗi kết nối server", success: false });
  }
};
