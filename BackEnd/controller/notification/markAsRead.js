const NotificationModel = require("../../model/Notification.Model");

exports.markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        const { notiId } = req.params;
        // Cập nhật tất cả thông báo chưa đọc thành đã đọc
        await NotificationModel.updateMany(
            { recipient: userId, isRead: false, _id: notiId },
            { $set: { isRead: true } }
        );
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error("Lỗi cập nhật thông báo:", error);
        return res.status(500).json({ success: false });
    }
};