const User = require("../../model/User.Model");
const UserProfile = require("../../model/UserProfile.Model");
const UserSession = require("../../model/UserSession.Model");
const NotificationSetting = require("../../model/NotificationSetting.Model");

// ==========================================
// XÓA TÀI KHOẢN CHƯA XÁC THỰC (TÀI KHOẢN RÁC)
// ==========================================
exports.deleteUnverifiedUser = async (userId) => {
    // Chạy song song các tiến trình xóa để tăng tốc
    await Promise.all([
        User.findByIdAndDelete(userId),
        UserProfile.findOneAndDelete({ user: userId }),
        UserSession.deleteMany({ userId }),
        NotificationSetting.findOneAndDelete({ userId })
    ]);
};