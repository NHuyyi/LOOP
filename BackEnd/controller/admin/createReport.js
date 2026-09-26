const Report = require("../../model/Report.Model");
const { checkAndTriggerAutoBan } = require("../../utils/Ban/autoBan");

exports.createReport = async (req, res) => {
    try {
        // Giả sử req.user._id lấy từ middleware xác thực (JWT Token)
        const reporterId = req.user.id;
        const { reportedUserId, reasonLabel, description, evidenceImage } = req.body;
    
        if (!reportedUserId || !reasonLabel) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin báo cáo." });
        }

        // 1. Tạo đơn tố cáo mới (Mặc định status là "pending")
        const newReport = new Report({
            reporter: reporterId,
            reportedUser: reportedUserId,
            reasonLabel,
            description,
            evidenceImage
        });

        // Nếu user này đã có 1 đơn pending với nạn nhân này, MongoDB sẽ văng lỗi E11000 nhờ cái Index chúng ta đã tạo
        await newReport.save();

        // 2. Kích hoạt Utils đếm và khóa tự động
        const banResult = await checkAndTriggerAutoBan(reportedUserId);

        return res.status(200).json({
            success: true,
            message: "Đã gửi báo cáo thành công.",
            // (Tùy chọn) Có thể trả về trạng thái khóa để hiển thị nếu cần, hoặc ẩn đi
            isBannedNow: banResult?.isBanned || false
        });

    } catch (error) {
        // Xử lý lỗi bắt spam từ Database
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Bạn đã báo cáo người này rồi. Vui lòng chờ hệ thống xử lý trước khi báo cáo lại."
            });
        }
        console.error("Lỗi khi tạo báo cáo:", error);
        return res.status(500).json({ success: false, message: "Lỗi máy chủ khi xử lý báo cáo." });
    }
};