const NotificationSetting = require("../../model/NotificationSetting.Model");

exports.subscribePush = async (req, res) => {
    try {
        const userId = req.user.id; // Lấy từ middleware xác thực token
        const { subscription } = req.body;

        if (!subscription || !subscription.endpoint) {
            return res.status(400).json({ success: false, message: "Dữ liệu subscription không hợp lệ" });
        }

        // BƯỚC 1 CỰC KỲ QUAN TRỌNG: Gỡ endpoint này khỏi TẤT CẢ các tài khoản khác
        // Điều này ngăn chặn 1 trình duyệt nhận push của nhiều tài khoản khi bạn test đăng xuất/đăng nhập
        await NotificationSetting.updateMany(
            { userId: { $ne: userId } },
            { $pull: { pushSubscriptions: { endpoint: subscription.endpoint } } }
        );

        // BƯỚC 2: Tìm hoặc tạo setting cho user hiện tại
        let settings = await NotificationSetting.findOne({ userId });

        if (!settings) {
            settings = new NotificationSetting({ userId, pushSubscriptions: [] });
        }

        if (!settings.pushSubscriptions) {
            settings.pushSubscriptions = [];
        }

        // BƯỚC 3: Kiểm tra xem thiết bị này đã lưu chưa, nếu chưa thì thêm vào
        const existingSubIndex = settings.pushSubscriptions.findIndex(
            sub => sub.endpoint === subscription.endpoint
        );

        if (existingSubIndex === -1) {
            settings.pushSubscriptions.push(subscription);
            await settings.save();
        }

        return res.status(200).json({
            success: true,
            message: "Đăng ký nhận thông báo đẩy thành công!"
        });
    } catch (error) {
        console.error("Lỗi khi lưu push subscription:", error);
        return res.status(500).json({ success: false, message: "Lỗi server" });
    }
};