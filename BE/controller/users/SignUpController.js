const bcrypt = require("bcrypt");
const UserModel = require("../../model/User.Model");
const generateOTP = require("../../utils/generateOTP");
const sendEmail = require("../../utils/sendEmail");
exports.SignUp = async (req, res) => {
  try {
    const { name, email, password, checkpassword } = req.body;

    // kiểm tra xem thông tin đã được điền đầy đủ chưa
    if (!name || !email || !password || !checkpassword) {
      return res.status(400).json({
        message: "vui lòng điền đầy đủ các thông tin",
        success: false,
      });
    }

    // kiểm tra xem email đã được sử dụng chưa
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email đã được sử dụng", success: false });
    }

    // kiểm tra xem mật khẩu có khớp không
    if (password !== checkpassword) {
      return res
        .status(400)
        .json({ message: "Mật khẩu không khớp", success: false });
    }

    // mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // tạo OIP và thời gian hết hạn
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 phút

    // tạo người dùng mới
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      otp: otp,
      otptype: "signup",
      otpExpires,
    });

    // lưu người dùng vào cơ sở dữ liệu
    await newUser.save();

    // gửi email xác nhận
    await sendEmail.sendEmail(
      email,
      "Xác nhận đăng ký",
      `Mã OTP của bạn là: ${otp}. Mã này sẽ hết hạn sau 5 phút và chỉ dùng 1 lần.`
    );

    return res.status(201).json({
      message: "Vui lòng kiểm tra email để xác nhận",
      success: true,
      email: email,
      user: newUser,
    });
  } catch (error) {
    console.error("lỗi đăng ký:", error);
    return res
      .status(500)
      .json({ message: "Kết nối server bị lỗi", success: false });
  }
};
