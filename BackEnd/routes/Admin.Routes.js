const express = require("express");
const router = express.Router();

// Import 2 middleware
const Authorization = require("../middleware/Authorization");
const authorize = require("../middleware/authorize");

router.post("/lock-user", Authorization, authorize("admin"), async (req, res) => {
    // Logic khóa tài khoản
    res.json({ success: true, message: "Đã khóa tài khoản user" });
});

module.exports = router;