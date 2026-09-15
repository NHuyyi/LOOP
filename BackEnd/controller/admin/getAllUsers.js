const UserModel = require("../../model/User.Model");
const UserStreak = require("../../model/UserStreak.Model");

exports.getAllUsers = async (req, res) => {
    try {
        // Lấy tất cả user (loại trừ admin để tránh tự khóa chính mình)
        const users = await UserModel.find({ role: "user" })
            .select("-password") // Không lấy password
            .lean();

        // Lấy điểm số từ UserStreak
        const userIds = users.map(u => u._id);
        const streaks = await UserStreak.find({ userId: { $in: userIds } }).lean();

        // Map điểm số theo userId
        const streakMap = {};
        streaks.forEach(s => {
            streakMap[s.userId.toString()] = s.totalPoints || 0;
        });

        // Ghép dữ liệu
        const data = users.map(u => ({
            id: u._id,
            name: u.name,
            avatar: u.avatar,
            friendCode: u.friendCode,
            email: u.email,
            points: streakMap[u._id.toString()] || 0,
            isVerified: u.isVerified,
            isdelete: u.isdelete,
            createdAt: u.createdAt,
            // banUntil: u.banUntil // (Sẽ thêm vào model sau cho tính năng khóa thời hạn)
        }));

        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("Lỗi get all users:", error);
        return res.status(500).json({ success: false, message: "Lỗi server" });
    }
};