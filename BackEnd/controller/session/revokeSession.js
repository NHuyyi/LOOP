const UserSession = require("../../model/UserSession.Model");
const { getIO, getOnlineUsers } = require("../../config/socker");

exports.revokeSession = async (req, res) => {
    try {
        const userId = req.user.id;
        const { sessionId } = req.params;

        const session = await UserSession.findOneAndUpdate(
            { _id: sessionId, userId: userId },
            { isActive: false },
            { new: true }
        );

        if (!session) {
            return res.status(404).json({ success: false, message: "Không tìm thấy phiên đăng nhập" });
        }

        const io = getIO();
        const onlineUsers = getOnlineUsers();
        const socketId = onlineUsers[userId.toString()];

        // Nếu user đang online, bắn sự kiện "forceLogout"
        if (socketId) {
            io.to(socketId).emit("forceLogout", {
                deviceId: session.deviceId,
                message: "Phiên đăng nhập đã bị vô hiệu hóa từ một thiết bị khác."
            });
        }
        
        return res.status(200).json({ success: true, message: "Đã đăng xuất thiết bị" });
    } catch (error) {
        console.error("Lỗi revokeSession:", error);
        return res.status(500).json({ success: false, message: "Lỗi server" });
    }
};