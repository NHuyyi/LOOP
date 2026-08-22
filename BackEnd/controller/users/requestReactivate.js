const UserModel = require("../../model/User.Model");
const bcrypt = require("bcrypt");
const generateOTP = require("../../utils/generateOTP");
const sendEmail = require("../../utils/sendEmail");

exports.requestReactivate = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại", success: false });
        }

        if (!user.isdelete) {
            return res.status(400).json({ message: "Tài khoản đang hoạt động bình thường", success: false });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Xác thực thất bại", success: false });
        }

        const otp = generateOTP();
        user.otp = otp;
        user.otptype = "reactivate"; // Đánh dấu loại OTP
        user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
        await user.save();

        await sendEmail.sendEmail(
            user.email,
            "Khôi phục tài khoản",
            `Mã OTP để khôi phục tài khoản của bạn là: ${otp}. Mã có hiệu lực trong 5 phút.`
        );

        return res.status(200).json({
            message: "Mã OTP đã được gửi đến email của bạn.",
            success: true,
            email: user.email
        });
    } catch (error) {
        console.error("Lỗi gửi OTP khôi phục:", error);
        return res.status(500).json({ message: "Lỗi server", success: false });
    }
};