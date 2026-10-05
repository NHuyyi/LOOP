const Report = require("../../model/Report.Model");

exports.getAllReports = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, reportedUserId, reasonLabel } = req.query;
        const query = {};
        if (status) query.status = status;
        if (reportedUserId) query.reportedUser = reportedUserId;
        if (reasonLabel) query.reasonLabel = reasonLabel;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Chạy song song 4 tác vụ truy vấn để lấy toàn bộ dữ liệu cần cho Dashboard
        const [reports, totalReports, pendingCount, labelStats] = await Promise.all([
            // 1. Lấy danh sách (như cũ)
            Report.find(query)
                .populate("reporter", "name email avatar")
                .populate("reportedUser", "name email avatar")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),

            // 2. Đếm tổng số đơn thỏa mãn bộ lọc
            Report.countDocuments(query),

            // 3. Đếm tổng số đơn "pending" trên toàn hệ thống (bỏ qua bộ lọc)
            Report.countDocuments({ status: "pending" }),

            // 4. Thống kê số lượng theo từng nhãn (Aggregation để vẽ biểu đồ)
            Report.aggregate([
                { $group: { _id: "$reasonLabel", count: { $sum: 1 } } }
            ])
        ]);

        return res.status(200).json({
            success: true,
            data: reports,
            dashboardStats: {
                total: totalReports,
                pending: pendingCount,
                processed: totalReports - pendingCount,
                byLabels: labelStats // Trả về mảng: [{ _id: 'spam', count: 10 }, ...]
            },
            pagination: {
                total: totalReports,
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalReports / limit)
            }
        });

    } catch (error) {
        console.error("Lỗi khi lấy danh sách báo cáo:", error);
        return res.status(500).json({ success: false, message: "Lỗi máy chủ." });
    }
};