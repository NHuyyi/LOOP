/* ── Tên Việt ngẫu nhiên ── */
const VIET_NAMES = [
  "Nguyễn Minh Anh", "Trần Quốc Phong", "Lê Thu Hà", "Phạm Bảo Long", "Hoàng Thị Lan",
  "Vũ Đức Huy", "Đặng Kim Oanh", "Bùi Trọng Nghĩa", "Ngô Thị Mai", "Đỗ Minh Tuấn",
  "Lý Hoàng Nam", "Phan Thị Thảo", "Trịnh Văn Khoa", "Đinh Thị Hoa", "Nguyễn Thanh Tùng",
  "Trần Thị Linh", "Lê Văn Dũng", "Phạm Thu Trang", "Hoàng Quang Vinh", "Vũ Thị Ngọc",
  "Đặng Văn Tâm", "Bùi Thị Hằng", "Ngô Minh Đức", "Đỗ Thị Nhung", "Lý Văn Hưng",
  "Phan Thanh Hải", "Trịnh Thị Vân", "Đinh Hoàng Long", "Nguyễn Bích Ngọc", "Trần Đình Khải",
  "Lê Thị Phương", "Phạm Văn Tài", "Hoàng Thị Yến", "Vũ Quang Minh", "Đặng Thị Thúy",
  "Bùi Văn Lộc", "Ngô Thị Hường", "Đỗ Văn Thắng", "Lý Thị Hà", "Phan Văn Bình",
  "Trịnh Minh Khoa", "Đinh Thị Lan", "Nguyễn Quốc Khánh", "Trần Thị Kim Anh", "Lê Hoàng Phúc",
  "Phạm Thị Nga", "Hoàng Văn Sơn", "Vũ Thị Thoa", "Đặng Minh Quân", "Bùi Thị Duyên",
];

const generateAvatar = (i) => `https://i.pravatar.cc/150?img=${(i % 70) + 1}`;

/* ── Top 50 — điểm toàn cầu ── */
export const GLOBAL_POINTS_LEADERBOARD = VIET_NAMES.map((name, i) => ({
  id: i + 1,
  name,
  avatar: generateAvatar(i),
  points: Math.max(500, 5000 - i * 92 + (i % 3 === 0 ? 40 : -20)),
  tasksCompleted: Math.max(20, 250 - i * 4),
}));

/* ── Top 50 — chuỗi bạn bè ── */
export const FRIEND_STREAK_LEADERBOARD = [...VIET_NAMES]
  .reverse()
  .map((name, i) => ({
    id: i + 1,
    name,
    avatar: generateAvatar(i + 5),
    streak: Math.max(1, 120 - i * 2 + (i % 4 === 0 ? 5 : 0)),
    lastActive: i === 0 ? "Vừa xong" : i < 10 ? "Hôm nay" : i < 25 ? "Hôm qua" : "2 ngày trước",
    isOnline: i % 3 === 0,
  }));

/* ── Nhiệm vụ ── */
export const DAILY_TASKS = [
  { id: 1, title: "Nhắn tin cho 1 người bạn", points: 20, icon: "💬", completed: true },
  { id: 2, title: "Đăng 1 bài viết", points: 30, icon: "📝", completed: true },
  { id: 3, title: "React bài viết của bạn bè", points: 10, icon: "❤️", completed: false },
  { id: 4, title: "Đăng nhập hôm nay", points: 10, icon: "🔥", completed: false },
  { id: 5, title: "Bình luận bài viết", points: 15, icon: "💭", completed: false },
];

export const WEEKLY_TASKS = [
  { id: 6, title: "Nhắn tin 7 ngày liên tục", points: 200, icon: "🏆", completed: false },
  { id: 7, title: "Kết bạn với người mới", points: 100, icon: "🤝", completed: true },
  { id: 8, title: "Đăng 5 bài viết trong tuần", points: 150, icon: "🌟", completed: false },
];

/* ── Hằng số ── */
export const MY_POINTS = 2410;
export const MY_RANK = 2;
