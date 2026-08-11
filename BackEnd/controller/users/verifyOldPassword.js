const UserModel = require("../../model/User.Model");
const bcrypt = require("bcrypt");

exports.verifyOldPassword = async (req, res) => {
    try {
        const { oldPassword } = req.body;
        const userId = req.user.id;

        const user = await UserModel.findById(userId);
        if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng", success: false });

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Mật khẩu cũ không chính xác", success: false });
        }

        return res.status(200).json({ message: "Xác thực thành công", success: true });
    } catch (error) {
        console.error("Lỗi xác thực mật khẩu:", error);
        return res.status(500).json({ message: "Lỗi server", success: false });
    }
};