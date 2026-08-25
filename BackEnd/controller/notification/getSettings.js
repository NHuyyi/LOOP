const NotificationSetting = require("../../model/NotificationSetting.Model");

exports.getSettings = async (req, res) => {
    try {
        let settings = await NotificationSetting.findOne({ userId: req.user.id });
        if (!settings) {
            settings = await NotificationSetting.create({ userId: req.user.id });
        }
        return res.status(200).json({ success: true, data: settings });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server" });
    }
};