// controller/chat/conversation/startAdminChat.js
const Conversation = require("../../../model/Conversation.Model");
const { getIO, getOnlineUsers } = require("../../../config/socker");

exports.startAdminChat = async (req, res) => {
    try {
        const adminId = req.user.id;
        const { targetUserId } = req.body;

        if (!targetUserId) {
            return res.status(400).json({ success: false, message: "Thiếu ID người dùng đích!" });
        }

        // Tìm xem đã có cuộc trò chuyện admin_direct nào chưa
        let conversation = await Conversation.findOne({
            participants: { $all: [adminId, targetUserId] },
            type: "admin_direct"
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [adminId, targetUserId],
                type: "admin_direct",
                status: "active"
            });
        } else if (conversation.status === "closed") {
            // Mở lại nếu đã đóng
            conversation.status = "active";
            await conversation.save();
        }

        // Bắn socket báo cho user biết MiniChat nên đổi sang trạng thái Editable
        const io = getIO();
        const onlineUsers = getOnlineUsers();
        const socketId = onlineUsers[String(targetUserId)];

        if (socketId) {
            io.to(socketId).emit("adminReopenedChat", {
                conversationId: conversation._id,
                status: 'active'
            });
        }

        return res.status(200).json({ success: true, conversation });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server" });
    }
};