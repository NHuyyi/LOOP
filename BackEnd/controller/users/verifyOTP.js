const isOTPExpired = require("../../utils/OTPExpired");
const UserModel = require("../../model/User.Model");
const UserSessionModel = require("../../model/UserSession.Model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UAParser = require("ua-parser-js");

async function getLocationFromIP(ip) {
  // IP localhost → không thể tra cứu, trả về thông báo rõ ràng
  if (ip === "::1" || ip === "127.0.0.1") {
    return "Localhost (Đang phát triển)";
  }
  try {
    // ip-api.com: miễn phí, 45 req/phút, không cần API key
    // fields chỉ lấy những gì cần để giảm payload
    const res = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,city,regionName,country&lang=vi`,
      { signal: AbortSignal.timeout(3000) } // timeout 3 giây tránh block login
    );
    const geo = await res.json();
    if (geo.status === "success") {
      return `${geo.city || geo.regionName || "Unknown City"}, ${geo.country}`;
    }
    return "Không xác định";
  } catch {
    // Nếu API lỗi hoặc timeout → không block luồng login
    return "Không xác định";
  }
}

exports.verifyOTP = async (req, res) => {
  try {
    const { email, password, otp, deviceId } = req.body;

    // Kiểm tra xem email có được cung cấp không
    if (!email) {
      return res.status(400).json({ message: "Vui lòng cung cấp email" });
    }

    if (!deviceId) {
      return res.status(400).json({
        message: "Thiếu thông tin thiết bị",
        success: false,
      });
    }

    // tìm người dùng theo email
    const user = await UserModel.findOne({ email }).populate(
      "friends",
      "name avatar"
    ).populate("profile");
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

    // SỬA LẠI ĐOẠN NÀY
    if (user.otptype === "2fa") {
      updatedUser = await UserModel.findOneAndUpdate(
        { email },
        {
          otp: null,
          otptype: null,
          otpExpires: null,
        },
        { new: true }
      )
        .populate("profile")
        .populate("friends", "name avatar");
    }

    if (user.otptype === "reactivate") {
      updatedUser = await UserModel.findOneAndUpdate(
        { email },
        {
          isdelete: false, // Mở khóa tài khoản
          otp: null,
          otptype: null,
          otpExpires: null,
        },
        { new: true }
      )
        .populate("profile")
        .populate("friends", "name avatar");
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, deviceId: deviceId },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    if (deviceId) {
      // 1. Phân tích User-Agent để lấy Trình duyệt và Hệ điều hành
      const parser = new UAParser(req.headers["user-agent"]);
      const result = parser.getResult();
      const browserName = `${result.browser.name || "Unknown"} ${result.browser.version || ""}`;
      const deviceName = `${result.os.name || "Unknown"} ${result.os.version || ""}`;

      // 2. Lấy IP thực của người dùng (x-forwarded-for khi qua proxy/nginx)
      const rawIp = req.headers["x-forwarded-for"]?.split(",")[0].trim()
        || req.socket.remoteAddress;
      const ipAddress = rawIp;

      // 3. Lấy vị trí từ IP qua ip-api.com (async, không block nếu lỗi)
      const location = await getLocationFromIP(ipAddress);

      // 4. Tìm session hiện có (kể cả đã bị revoke)
      //    → Nếu có: update lại (bật isActive nếu bị revoke)
      //    → Nếu chưa có: tạo mới
      //    Cách này tránh tạo bản ghi trùng và đảm bảo session bị revoke
      //    sẽ được kích hoạt lại thay vì bị nhân đôi.
      const existingSession = await UserSessionModel.findOne({
        userId: user._id,
        deviceId: deviceId,
      });

      if (existingSession) {
        // Session đã tồn tại (dù đang active hay đã bị revoke) → cập nhật
        await UserSessionModel.updateOne(
          { _id: existingSession._id },
          {
            $set: {
              deviceName,
              browserName,
              ipAddress,
              location,
              isActive: true,   // bật lại nếu trước đó bị revoke
              lastActiveAt: new Date(),
            },
          }
        );
      } else {
        // Thiết bị hoàn toàn mới → tạo bản ghi mới
        await UserSessionModel.create({
          userId: user._id,
          deviceId,
          deviceName,
          browserName,
          ipAddress,
          location,
          isActive: true,
          lastActiveAt: new Date(),
        });
      }
    }

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
