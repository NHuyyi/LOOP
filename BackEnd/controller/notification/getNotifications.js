const NotificationModel = require("../../model/Notification.Model");

exports.getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        // Lấy 50 thông báo mới nhất của user này
        const notifications = await NotificationModel.find({ recipient: userId })
            .sort({ createdAt: -1 })
            .limit(50)
            .populate("sender", "name avatar");

        return res.status(200).json({ success: true, data: notifications });
    } catch (error) {
        console.error("Lỗi lấy thông báo:", error);
        return res.status(500).json({ success: false, message: "Lỗi server" });
    }
};