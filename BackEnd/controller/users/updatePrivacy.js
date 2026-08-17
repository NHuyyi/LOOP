const UserModel = require("../../model/User.Model");

exports.updatePrivacy = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            allowSearchByCode,
            allowFriendRequests,
            showActiveStatus,
            defaultPostVisibility,
            defaultDenyList
        } = req.body;

        let updateData = {};
        if (allowSearchByCode !== undefined) updateData.allowSearchByCode = allowSearchByCode;
        if (allowFriendRequests !== undefined) updateData.allowFriendRequests = allowFriendRequests;
        if (showActiveStatus !== undefined) updateData.showActiveStatus = showActiveStatus;
        if (defaultPostVisibility !== undefined) updateData.defaultPostVisibility = defaultPostVisibility;
        if (defaultDenyList !== undefined) updateData.defaultDenyList = defaultDenyList;
        
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { $set: updateData },
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