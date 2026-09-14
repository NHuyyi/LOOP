const express = require("express");
const router  = express.Router();
const authorize = require("../middleware/authorize");
const Authorization = require("../middleware/Authorization");

const getMyStats               = require("../controller/streak/getMyStats");
const getPointsLeaderboard     = require("../controller/streak/getPointsLeaderboard");
const getFriendStreakLeaderboard = require("../controller/streak/getFriendStreakLeaderboard");

// ── Thống kê cá nhân ─────────────────────────────────────────
// GET /api/streak/my-stats
// Trả về: tổng điểm, điểm hôm nay, xếp hạng, danh sách tasks + completed
router.get("/my-stats", Authorization, authorize("user"), getMyStats.getMyStats);

// ── Bảng xếp hạng điểm toàn cầu ─────────────────────────────
// GET /api/streak/leaderboard/points?limit=50
router.get("/leaderboard/points",Authorization, authorize("user"), getPointsLeaderboard.getPointsLeaderboard);

// ── Bảng xếp hạng chuỗi bạn bè ──────────────────────────────
// GET /api/streak/leaderboard/friends?limit=50
router.get("/leaderboard/friends",Authorization, authorize("user"), getFriendStreakLeaderboard.getFriendStreakLeaderboard);

module.exports = router;
