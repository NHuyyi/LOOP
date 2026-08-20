const jwt = require("jsonwebtoken");
const UserSession = require("../model/UserSession.Model");

async function Authorization(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "chưa đăng nhập" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.deviceId) {
      const activeSession = await UserSession.findOne({
        userId: decoded.id,
        deviceId: decoded.deviceId,
        isActive: true, // Bắt buộc phải còn true
      });

      // Nếu không tìm thấy session, hoặc isActive đã bị đổi thành false
      if (!activeSession) {
        return res.status(401).json({
          message: "Phiên đăng nhập đã bị vô hiệu hóa hoặc đăng xuất từ nơi khác.",
          isRevoked: true // Flag cho FE biết để tự redirect ra màn hình login
        });
      }
    }

    req.user = decoded; // Lưu thông tin người dùng vào req.user
    next();
  } catch (error) {
    res
      .status(403)
      .json({ message: "token không hợp lệ", message: error.message });
  }
}

module.exports = Authorization;
