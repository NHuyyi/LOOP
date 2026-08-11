const UserModel = require("../../model/User.Model");
const UserProfileModel = require("../../model/UserProfile.Model");

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            name, avatar, // Thuộc User
            coverPhoto, bio, phoneNumber, gender, dateOfBirth, location // Thuộc UserProfile
        } = req.body;

        // 1. Cập nhật thông tin Core (User)
        let updateUserData = {};
        if (name) updateUserData.name = name;
        if (avatar) updateUserData.avatar = avatar;

        let updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            updateUserData,
            { new: true }
        );

        // 2. Cập nhật (hoặc tạo mới) thông tin Profile bằng upsert: true
        const updatedProfile = await UserProfileModel.findOneAndUpdate(
            { user: userId },
            { coverPhoto, bio, phoneNumber, gender, dateOfBirth, location },
            { new: true, upsert: true } // Upsert: Nếu chưa có thì tự động tạo record mới
        );

        // 3. Nếu User chưa có liên kết ID tới Profile, thì liên kết lại
        if (!updatedUser.profile) {
            updatedUser.profile = updatedProfile._id;
            await updatedUser.save();
        }

        // 4. Lấy lại toàn bộ thông tin đã gộp để trả về FE
        const finalUser = await UserModel.findById(userId)
            .populate("profile") // Tự động nối dữ liệu từ UserProfile vào
            .populate("friends", "name avatar");

        return res.status(200).json({
            message: "Cập nhật thông tin thành công!",
            success: true,
            user: finalUser,
        });
    } catch (error) {
        console.error("Lỗi cập nhật Profile:", error);
        return res.status(500).json({ message: "Lỗi server", success: false });
    }
};