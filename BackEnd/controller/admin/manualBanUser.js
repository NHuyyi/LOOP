const { applyManualBan } = require("../../utils/Ban/applyManualBan");
const User = require("../../model/User.Model");
const Report = require("../../model/Report.Model"); // THÊM MODEL REPORT

exports.manualBanUser = async (req, res) => {
    try {
        // Nhận thêm reportId
        const { targetUserId, penaltyLevel, reasonLabels, reportId } = req.body;

        if (!targetUserId) return res.status(400).json({ success: false, message: "Thiếu targetUserId." });
        if (!targetUserId || penaltyLevel === undefined) return res.status(400).json({ success: false, message: "Thiếu dữ liệu." });
        if (penaltyLevel < 0 || penaltyLevel > 5) return res.status(400).json({ success: false, message: "Cấp độ phạt không hợp lệ." });

        const penaltyResult = await applyManualBan(targetUserId, penaltyLevel, reasonLabels);

        if (penaltyLevel === 5) await User.findByIdAndUpdate(targetUserId, { isdelete: true });
        else if (penaltyLevel === 0) await User.findByIdAndUpdate(targetUserId, { isdelete: false });

        // CẬP NHẬT TRẠNG THÁI REPORT LÀ ĐÃ XỬ LÝ
        if (reportId) {
            await Report.findByIdAndUpdate(reportId, {
                status: "processed",
                actionTaken: "banned"
            });
            await Notification.create({
                user: report.reporter,
                type: "report_processed",
                message: `Báo cáo của bạn đã được xử lý. `,
                read: false
            });
        }


        return res.status(200).json({ success: true, message: `Áp dụng hình phạt Level ${penaltyLevel} thành công.`, data: penaltyResult });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ." });
    }
};