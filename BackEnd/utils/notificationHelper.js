const NotificationModel = require("../model/Notification.Model");
const { getIO, getOnlineUsers } = require("../config/socker");

exports.createAndEmitNotification = async ({ recipientId, senderId, type, postId = null, url = "" }) => {
    try {
        // Không tự gửi thông báo cho chính mình
        if (String(recipientId) === String(senderId)) return;

        // Lưu vào DB
        const newNoti = await NotificationModel.create({
            recipient: recipientId,
            sender: senderId,
            type,
            post: postId,
            url,
        });

        const populatedNoti = await newNoti.populate("sender", "name avatar");

        // Bắn Socket Realtime
        const io = getIO();
        const onlineUsers = getOnlineUsers();
        const receiverSocketId = onlineUsers[recipientId];

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newNotification", populatedNoti);
        }
    } catch (error) {
        console.error("Lỗi tạo thông báo:", error);
    }
};