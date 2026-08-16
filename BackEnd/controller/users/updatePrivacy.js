const UserModel = require("../../model/User.Model");

exports.updatePrivacy = async (req, res) => {
    try {
        const userId = req.user.id;
        const { allowSearchByCode, allowFriendRequests,showActiveStatus } = req.body;

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { allowSearchByCode, allowFriendRequests,showActiveStatus },
            { new: true }
        ).populate("profile").populate("friends", "name avatar");

        return res.status(200).json({
            success: true,
            message: "Cập nhật quyền riêng tư thành công",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Lỗi cập nhật quyền riêng tư:", error);
        return res.status(500).json({ message: "Lỗi server", success: false });
    }
};