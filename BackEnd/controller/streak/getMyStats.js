const UserStreak = require("../../model/UserStreak.Model");
const { getOrCreateStreak } = require("../../utils/streakHelper");
const { DAILY_TASKS, WEEKLY_TASKS } = require("../../utils/taskDefinitions");

/**
 * GET /api/streak/my-stats
 * Trả về: điểm hôm nay, tổng điểm, xếp hạng, danh sách nhiệm vụ + trạng thái completed
 */
exports.getMyStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const streak = await getOrCreateStreak(userId);

    // ── Tính điểm hôm nay từ tasks đã hoàn thành ─────
    const todayPoints = [...DAILY_TASKS, ...WEEKLY_TASKS]
      .filter((t) => {
        if (DAILY_TASKS.find((d) => d.id === t.id)) {
          return streak.completedDailyTasks.includes(t.id);
        }
        return streak.completedWeeklyTasks.includes(t.id);
      })
      .reduce((sum, t) => sum + t.points, 0);

    // ── Xếp hạng (đếm số user có điểm cao hơn + 1) ──
    const rank = await UserStreak.countDocuments({
      totalPoints: { $gt: streak.totalPoints },
    }) + 1;

    // ── Trả về tasks với trạng thái completed ─────────
    const dailyWithStatus = DAILY_TASKS.map((t) => ({
      ...t,
      completed: streak.completedDailyTasks.includes(t.id),
    }));
    const weeklyWithStatus = WEEKLY_TASKS.map((t) => ({
      ...t,
      completed: streak.completedWeeklyTasks.includes(t.id),
    }));

    return res.json({
      success: true,
      data: {
        totalPoints: streak.totalPoints,
        todayPoints,
        rank,
        dailyTasks: dailyWithStatus,
        weeklyTasks: weeklyWithStatus,
      },
    });
  } catch (err) {
    console.error("getMyStats error:", err);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
