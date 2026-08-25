const NotificationSetting = require("../../model/NotificationSetting.Model");

exports.updateSettings = async (req, res) => {
    try {
        const settings = await NotificationSetting.findOneAndUpdate(
            { userId: req.user.id },
            { $set: req.body },
            { new: true, upsert: true }
        );
        return res.status(200).json({ success: true, data: settings });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server" });
    }
};