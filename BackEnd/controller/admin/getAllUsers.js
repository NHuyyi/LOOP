const UserModel = require("../../model/User.Model");
const UserStreak = require("../../model/UserStreak.Model");
const UserPenalty = require("../../model/UserPenalty.Model");

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

        const penalties = await UserPenalty.find({ user: { $in: userIds } }).lean();
        const penaltyMap = {};
        penalties.forEach(p => {
            penaltyMap[p.user.toString()] = p;
        });

        const now = new Date();

        // Ghép dữ liệu
        const data = users.map(u => {
            const penalty = penaltyMap[u._id.toString()];

            // Tài khoản bị khóa nếu: có penaltyLevel > 0 VÀ (khóa vĩnh viễn HOẶC hạn banUntil vẫn còn trong tương lai)
            const isCurrentlyBanned = penalty && penalty.penaltyLevel > 0 &&
                (penalty.isPendingPermanent || (penalty.banUntil && now < new Date(penalty.banUntil)));

            return {
                id: u._id,
                name: u.name,
                avatar: u.avatar,
                friendCode: u.friendCode,
                email: u.email,
                points: streakMap[u._id.toString()] || 0,
                isVerified: u.isVerified,
                isdelete: u.isdelete,
                createdAt: u.createdAt,

                // Trả về trường ảo cho Frontend sử dụng
                isBanned: isCurrentlyBanned || u.isdelete, // Coi cả isdelete là bị khóa
                penaltyLevel: penalty?.penaltyLevel || 0,
                banUntil: penalty?.banUntil || null
            };
        });

        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("Lỗi get all users:", error);
        return res.status(500).json({ success: false, message: "Lỗi server" });
    }
};