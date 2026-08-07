const UserStreak = require("../model/UserStreak.Model");
const { ALL_TASKS, DAILY_IDS, WEEKLY_IDS } = require("./taskDefinitions");

/**
 * Trả về document UserStreak của user (tự tạo nếu chưa có).
 * Tự động reset nhiệm vụ ngày/tuần khi đã sang ngày mới / tuần mới.
 */
const getOrCreateStreak = async (userId) => {
  let streak = await UserStreak.findOne({ userId });

  if (!streak) {
    streak = await UserStreak.create({ userId });
  }

  const now  = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // ── Reset nhiệm vụ ngày ─────────────────────────────
  const lastDaily = streak.lastDailyReset
    ? new Date(streak.lastDailyReset.getFullYear(), streak.lastDailyReset.getMonth(), streak.lastDailyReset.getDate())
    : null;

  if (!lastDaily || lastDaily < today) {
    streak.completedDailyTasks = [];
    streak.lastDailyReset = now;
  }

  // ── Reset nhiệm vụ tuần (thứ 2 đầu tuần) ───────────
  const getMonday = (d) => {
    const day = d.getDay(); // 0=CN, 1=T2...
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.getFullYear(), d.getMonth(), diff);
  };
  const thisMonday = getMonday(now);
  const lastWeekly = streak.lastWeeklyReset
    ? getMonday(streak.lastWeeklyReset)
    : null;

  if (!lastWeekly || lastWeekly < thisMonday) {
    streak.completedWeeklyTasks = [];
    streak.weeklyPostCount = 0;
    streak.lastWeeklyReset = now;
  }

  await streak.save();
  return streak;
};

/**
 * Đánh dấu hoàn thành 1 task và cộng điểm.
 * @returns {boolean} true nếu task được hoàn thành lần đầu
 */
const completeTaskForUser = async (userId, taskId) => {
  const streak = await getOrCreateStreak(userId);
  const task   = ALL_TASKS.find((t) => t.id === taskId);
  if (!task) return false;

  const isDaily  = DAILY_IDS.includes(taskId);
  const field    = isDaily ? "completedDailyTasks" : "completedWeeklyTasks";
  const alreadyDone = streak[field].includes(taskId);
  if (alreadyDone) return false;

  streak[field].push(taskId);
  streak.totalPoints += task.points;
  await streak.save();
  return true;
};

/**
 * Tăng số lượng bài viết trong tuần. Nếu đạt 5, tự động hoàn thành Task 8.
 */
const incrementWeeklyPostCount = async (userId) => {
  const streak = await getOrCreateStreak(userId);
  streak.weeklyPostCount = (streak.weeklyPostCount || 0) + 1;
  await streak.save();

  if (streak.weeklyPostCount >= 5) {
    await completeTaskForUser(userId, 8);
  }
};

module.exports = { getOrCreateStreak, completeTaskForUser, incrementWeeklyPostCount };
