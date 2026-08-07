// Định nghĩa nhiệm vụ — dùng chung cho cả BE và FE
const DAILY_TASKS = [
  { id: 1, title: "Nhắn tin cho 1 người bạn", points: 20, icon: "💬" },
  { id: 2, title: "Đăng 1 bài viết",           points: 30, icon: "📝" },
  { id: 3, title: "React bài viết của bạn bè", points: 10, icon: "❤️" },
  { id: 4, title: "Đăng nhập hôm nay",         points: 10, icon: "🔥" },
  { id: 5, title: "Bình luận bài viết",         points: 15, icon: "💭" },
];

const WEEKLY_TASKS = [
  { id: 6, title: "Nhắn tin 7 ngày liên tục",    points: 200, icon: "🏆" },
  { id: 7, title: "Kết bạn với người mới",        points: 100, icon: "🤝" },
  { id: 8, title: "Đăng 5 bài viết trong tuần",  points: 150, icon: "🌟" },
];

const ALL_TASKS = [...DAILY_TASKS, ...WEEKLY_TASKS];
const DAILY_IDS  = DAILY_TASKS.map((t) => t.id);
const WEEKLY_IDS = WEEKLY_TASKS.map((t) => t.id);

module.exports = { DAILY_TASKS, WEEKLY_TASKS, ALL_TASKS, DAILY_IDS, WEEKLY_IDS };
