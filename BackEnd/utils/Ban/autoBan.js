const Report = require("../../model/Report.Model");
const UserPenalty = require("../../model/UserPenalty.Model");
const User = require("../../model/User.Model"); // BỔ SUNG: Import model User
const { determineNextPenaltyLevel } = require("./determineNextPenaltyLevel.js")
const { calculateBanDuration } = require("./calculateBanDuration.js")

const checkAndTriggerAutoBan = async (reportedUserId) => {
    try {
        const pendingReports = await Report.find({
            reportedUser: reportedUserId,
            status: "pending"
        });

        if (pendingReports.length < 5) {
            return { isBanned: false, currentPending: pendingReports.length };
        }

        const reasonLabels = [...new Set(pendingReports.map(r => r.reasonLabel))];
        let penaltyRecord = await UserPenalty.findOne({ user: reportedUserId });

        const nextLevel = determineNextPenaltyLevel(penaltyRecord);
        const banUntil = calculateBanDuration(nextLevel);
        const isPendingPermanent = nextLevel === 5;

        if (!penaltyRecord) {
            penaltyRecord = new UserPenalty({
                user: reportedUserId,
                penaltyLevel: nextLevel,
                banUntil: banUntil,
                isPendingPermanent: isPendingPermanent,
                history: [{ levelApplied: nextLevel, reasonLabels, type: "auto" }]
            });
        } else {
            penaltyRecord.penaltyLevel = nextLevel;
            penaltyRecord.banUntil = banUntil;
            penaltyRecord.isPendingPermanent = isPendingPermanent;
            penaltyRecord.history.push({ levelApplied: nextLevel, reasonLabels, type: "auto" });
        }

        await penaltyRecord.save();

        // BỔ SUNG 1: Cập nhật isdelete: true cho User nếu đạt Level 5 (Khóa vĩnh viễn)
        if (nextLevel === 5) {
            await User.findByIdAndUpdate(reportedUserId, { isdelete: true });
        }

        // BỔ SUNG 2: Thêm actionTaken: "banned" để Frontend nhận dạng được hành động
        await Report.updateMany(
            { reportedUser: reportedUserId, status: "pending" },
            { $set: { status: "processed", actionTaken: "banned" } }
        );

        return {
            isBanned: true,
            level: nextLevel,
            banUntil: banUntil,
            isPendingPermanent
        };
    } catch (error) {
        console.error("Lỗi trong quá trình kích hoạt Auto Ban:", error);
        throw error;
    }
}

module.exports = { checkAndTriggerAutoBan };