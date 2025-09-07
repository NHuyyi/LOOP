const jwt = require("jsonwebtoken");

function Authorization(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "chưa đăng nhập" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Lưu thông tin người dùng vào req.user
    next();
  } catch (error) {
    res
      .status(403)
      .json({ message: "token không hợp lệ", message: error.message });
  }
}

module.exports = Authorization;
