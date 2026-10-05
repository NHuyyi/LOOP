const UserModel = require("../../model/User.Model");
const { deleteUnverifiedUser } = require("../../utils/DeleteUser/deleteUnverifiedUser");

exports.hardDeleteUser = async (req, res) => {
    try {
        const { targetUserId, confirmEmail } = req.body;

        if (!confirmEmail) {
            return res.status(400).json({ success: false, message: "Vui lòng nhập Email xác nhận xóa." });
        }

        if (!targetUserId) {
            return res.status(400).json({ success: false, message: "Thiếu dữ liệu xác nhận xóa." });
        }

        const user = await UserModel.findById(targetUserId);
        if (!user) {
            return res.status(404).json({ success: false, message: "Không tìm thấy người dùng." });
        }

        // BƯỚC BẢO MẬT: So khớp Email gõ tay
        if (user.email !== confirmEmail) {
            return res.status(400).json({ success: false, message: "Email xác nhận không khớp!" });
        }

        // TRƯỜNG HỢP 1: TÀI KHOẢN CHƯA XÁC THỰC (XÓA ĐƯỢC NGAY)
        if (!user.isVerified) {
            await deleteUnverifiedUser(targetUserId);
            return res.status(200).json({
                success: true,
                message: "Đã xóa tài khoản thành công"
            });
        }

        // TRƯỜNG HỢP 2: TÀI KHOẢN ĐÃ XÁC THỰC (CHỜ TÍNH NĂNG KHÓA VĨNH VIỄN)
        console.log(`[Đang phát triển] Yêu cầu xóa tài khoản đã xác thực: ${user.email} (ID: ${user._id})`);

        return res.status(200).json({
            success: false, // Trả về false để Frontend không đóng Modal hoặc không thông báo thành công
            message: "Tính năng xóa tài khoản đã xác thực đang được phát triển, chờ hoàn thiện model Khóa tài khoản."
        });

    } catch (error) {
        console.error("Lỗi khi xóa cứng user:", error);
        return res.status(500).json({ success: false, message: "Lỗi máy chủ khi xóa tài khoản." });
    }
};