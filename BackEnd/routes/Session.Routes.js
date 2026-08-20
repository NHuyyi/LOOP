const express = require("express");
const router = express.Router();
const authorize = require("../middleware/Authorization");
const getActiveSessions = require("../controller/session/getActiveSessions");
const revokeSession = require("../controller/session/revokeSession");
// Lấy danh sách thiết bị
router.get("/active", authorize, getActiveSessions.getActiveSessions);

// Xoá (đăng xuất) 1 thiết bị
router.put("/revoke/:sessionId", authorize, revokeSession.revokeSession);

module.exports = router;