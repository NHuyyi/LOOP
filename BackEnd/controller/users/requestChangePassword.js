const UserModel = require("../../model/User.Model");
const generateOTP = require("../../utils/generateOTP");
const sendEmail = require("../../utils/sendEmail");

exports.requestChangePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await UserModel.findById(userId);

        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

        user.otp = otp;
        user.otptype = "change";
        user.otpExpires = otpExpires;
        await user.save();

        await sendEmail.sendEmail(
            user.email,
            "Xác thực đổi mật khẩu",
            `Mã OTP đổi mật khẩu của bạn là: ${otp}. Mã hết hạn sau 5 phút.`
        );

        return res.status(200).json({ message: "Đã gửi mã OTP đến email của bạn", success: true });
    } catch (error) {
        console.error("Lỗi gửi OTP:", error);
        return res.status(500).json({ message: "Lỗi server", success: false });
    }
};