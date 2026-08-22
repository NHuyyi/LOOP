const UserSession = require("../../model/UserSession.Model");

exports.getActiveSessions = async (req, res) => {
    try {
        const userId = req.user.id; // Lấy từ middleware Authorization
        const sessions = await UserSession.find({ userId, isActive: true })
            .sort({ lastActiveAt: -1 });

        return res.status(200).json({ success: true, data: sessions });
    } catch (error) {
        console.error("Lỗi getActiveSessions:", error);
        return res.status(500).json({ success: false, message: "Lỗi server" });
    }
};