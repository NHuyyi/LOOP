const Report = require("../../model/Report.Model");
const { createAndEmitNotification } = require("../../utils/notificationHelper");

exports.rejectReport = async (req, res) => {
    try {
        const { reportId } = req.body;
        const adminId = req.user.id;

        const report = await Report.findByIdAndUpdate(reportId, {
            status: "processed",
            actionTaken: "rejected"
        }).populate("reporter");
        if (!report) return res.status(404).json({ success: false, message: "Không tìm thấy đơn tố cáo" });

        // Gửi thông báo cho người Report
        await createAndEmitNotification({
            recipientId: report.reporter._id,
            senderId: adminId, // Có thể dùng adminId hoặc tạo "Hệ thống"
            type: "report_rejected",
            url: `/friend/${report.reportedUser._id}`,
        });

        return res.status(200).json({ success: true, message: "Đã bác bỏ đơn tố cáo" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
    }
};