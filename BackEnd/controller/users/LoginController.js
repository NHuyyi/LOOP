const bcrypt = require("bcrypt");
const UserModel = require("../../model/User.Model");
const UserSessionModel = require("../../model/UserSession.Model");
const jwt = require("jsonwebtoken");
const { completeTaskForUser } = require("../../utils/streakHelper");
const UAParser = require("ua-parser-js");

const generateOTP = require("../../utils/generateOTP");
const sendEmail = require("../../utils/sendEmail");

/**
 * Lấy vị trí địa lý từ IP thông qua ip-api.com
 * @param {string} ip
 * @returns {Promise<string>} "Thành phố, Quốc gia" hoặc "Không xác định"
 */
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
exports.Login = async (req, res) => {
  try {
    const { email, password, deviceId } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Vui lòng điền đầy đủ các thông tin",
        success: false,
      });
    }

    if (!deviceId) {
      return res.status(400).json({
        message: "Thiếu thông tin thiết bị",
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
