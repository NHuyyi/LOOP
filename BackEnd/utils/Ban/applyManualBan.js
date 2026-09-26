const { calculateBanDuration } = require("./calculateBanDuration.js")
const UserPenalty = require("../../model/UserPenalty.Model")

exports.applyManualBan = async (userId, penaltyLevel, reasonLabels) => {
    try {
        // Tính toán hạn mở khóa dựa trên level Admin chọn
        const banUntil = calculateBanDuration(penaltyLevel);
        const isPendingPermanent = penaltyLevel === 5;

        // Lấy hồ sơ phạt hiện tại
        let penaltyRecord = await UserPenalty.findOne({ user: userId });

        if (!penaltyRecord) {
            // Nếu chưa có tiền án, tạo mới
            penaltyRecord = new UserPenalty({
                user: userId,
                penaltyLevel: penaltyLevel,
                banUntil: banUntil,
                isPendingPermanent: isPendingPermanent,
                history: [{ levelApplied: penaltyLevel, reasonLabels, type: "manual" }] // Lưu vết là "manual"
            });
        } else {
            // Nếu đã có hồ sơ, Admin ghi đè cấp độ phạt
            penaltyRecord.penaltyLevel = penaltyLevel;
            penaltyRecord.banUntil = banUntil;
            penaltyRecord.isPendingPermanent = isPendingPermanent;
            penaltyRecord.history.push({ levelApplied: penaltyLevel, reasonLabels, type: "manual" });
        }

        // Lưu vào DB
        await penaltyRecord.save();

        return {
            success: true,
            level: penaltyLevel,
            banUntil: banUntil,
            isPendingPermanent
        };
    } catch (error) {
        console.error("Lỗi khi Admin khóa thủ công:", error);
        throw error;
    }
};