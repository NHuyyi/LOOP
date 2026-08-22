const UserModel = require("../../model/User.Model");

exports.deactivateAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        // Đánh dấu isdelete = true
        await UserModel.findByIdAndUpdate(userId, { isdelete: true }, { new: true });

        return res.status(200).json({
            success: true,
            message: "Tài khoản đã được vô hiệu hóa. Bạn sẽ bị đăng xuất."
        });
    } catch (error) {
        console.error("Lỗi vô hiệu hóa tài khoản:", error);
        return res.status(500).json({ success: false, message: "Lỗi server" });
    }
};