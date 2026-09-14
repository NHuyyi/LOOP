const express = require("express");
const router = express.Router();
const authorize = require("../middleware/authorize");
const Authorization = require("../middleware/Authorization");
const getActiveSessions = require("../controller/session/getActiveSessions");
const revokeSession = require("../controller/session/revokeSession");
// Lấy danh sách thiết bị
router.get("/active", Authorization, authorize("user"), getActiveSessions.getActiveSessions);

// Xoá (đăng xuất) 1 thiết bị
router.put("/revoke/:sessionId", Authorization, authorize("user"), revokeSession.revokeSession);

module.exports = router;