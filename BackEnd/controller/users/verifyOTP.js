const isOTPExpired = require("../../utils/OTPExpired");
const UserModel = require("../../model/User.Model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.verifyOTP = async (req, res) => {
  try {
    const { email, password, otp } = req.body;

    // Kiểm tra xem email có được cung cấp không
    if (!email) {
      return res.status(400).json({ message: "Vui lòng cung cấp email" });
    }

    // tìm người dùng theo email
    const user = await UserModel.findOne({ email }).populate(
      "friends",
      "name avatar"
    );
    if (!user) {
      return res
        .status(404)
        .json({ message: "Người dùng không tồn tại", success: false });
    }

    // kiểm tra xem OTP có được nhập không
    if (!otp) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập OTP", success: false });
    }

    // kiểm tra xem OTP còn hiệu lực không
    if (isOTPExpired(user.otpExpires)) {
      return res
        .status(400)
        .json({ message: "OTP đã hết hạn", success: false });
    }

    // kiểm tra xem OTP có đúng không
    if (user.otp !== otp) {
      return res
        .status(400)
        .json({ message: "OTP không đúng", success: false });
    }

    // nếu OTP đúng
    const oldopttype = user.otptype;
    let updatedUser;
    // kiểm tra xem otp thuộc dạng nào nếu là signup xóa OTP và thời gian hết hạn, cập nhật isVerified về true
    if (user.otptype === "signup") {
      updatedUser = await UserModel.findOneAndUpdate(
        { email },
        {
          isVerified: true,
          otp: null,
          otptype: null,
          otpExpires: null,
        },
        { new: true } // trả về document sau khi update
      );
    }
    if (user.otptype === "reset") {
      updatedUser = await UserModel.findOneAndUpdate(
        { email },
        {
          otp: null,
          // otptype: null,
          otpExpires: null,
        },
        { new: true } // trả về document sau khi update
      );
    }
    if (user.otptype === "change") {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedUser = await UserModel.findOneAndUpdate(
        { email },
        {
          password: hashedPassword,
          otp: null,
          otptype: null,
          otpExpires: null,
        },
        { new: true } // trả về document sau khi update
      );
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Thời gian hết hạn của token
    );

    // hàm sẽ tìm kiếm người dùng theo email, nếu tìm thấy sẽ cập nhật trạng thái isVerified thành true, xóa OTP và thời gian hết hạn.
    return res.status(200).json({
      message: "Xác thực thành công!",
      otptype: oldopttype,
      user: updatedUser,
      token: token,
      success: true,
    });
  } catch (error) {
    console.error("lỗi xác thực OTP", error);
    return res
      .status(500)
      .json({ message: "Lỗi kết nối server", success: false });
  }
};
