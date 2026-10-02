// controller/chat/conversation/closeAdminChat.js
const Conversation = require("../../../model/Conversation.Model");
const { getIO, getOnlineUsers } = require("../../../config/socker");

exports.closeAdminChat = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const adminId = req.user.id;

        const conversation = await Conversation.findById(conversationId);
        if (!conversation || conversation.type !== "admin_direct") {
            return res.status(404).json({ success: false, message: "Không tìm thấy hội thoại hợp lệ" });
        }

        conversation.status = "closed";
        await conversation.save();

        // Bắn socket báo cho user biết UI cần chuyển sang Read-Only
        const io = getIO();
        const onlineUsers = getOnlineUsers();
        conversation.participants.forEach(participantId => {
            if (String(participantId) !== String(adminId)) {
                const socketId = onlineUsers[String(participantId)];
                if (socketId) {
                    io.to(socketId).emit("adminClosedChat", { conversationId });
                }
            }
        });

        return res.status(200).json({ success: true, message: "Đã đóng cuộc trò chuyện" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server" });
    }
};