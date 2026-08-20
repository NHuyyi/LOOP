// socket.js
const { Server } = require("socket.io");
const UserModel = require("../model/User.Model"); // Import Model để kiểm tra quyền riêng tư

let io;
let onlineUsers = {};

// THÊM HÀM NÀY: Lọc và phát danh sách online cho toàn hệ thống
async function broadcastOnlineUsers() {
  const onlineIds = Object.keys(onlineUsers);
  if (onlineIds.length === 0) {
    io.emit("update-online-users", []);
    return;
  }

  try {
    // Tìm những user đang cắm socket VÀ có bật showActiveStatus
    const visibleUsers = await UserModel.find({
      _id: { $in: onlineIds },
      showActiveStatus: { $ne: false } // Dùng $ne: false để bao gồm cả những user cũ chưa có trường này
    }).select('_id');

    // Chuyển mảng object thành mảng string ID
    const visibleUserIds = visibleUsers.map(u => u._id.toString());

    // Phát danh sách ĐÃ LỌC
    io.emit("update-online-users", visibleUserIds);
  } catch (error) {
    console.error("Lỗi khi lọc user online:", error);
  }
}

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // FE
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("register", async (userId) => {
      onlineUsers[userId] = socket.id;

      // THAY ĐỔI: Gọi hàm lọc thay vì phát trực tiếp
      await broadcastOnlineUsers();
    });

    // SỰ KIỆN MỚI: FE gọi hàm này khi vừa bật/tắt trạng thái trong Settings
    socket.on("force-update-online", async () => {
      await broadcastOnlineUsers();
    });

    // SỰ KIỆN: ĐANG GÕ PHÍM
    socket.on("typing", ({ senderId, receiverId, conversationId }) => {
      const receiverSocketId = onlineUsers[receiverId];
      if (receiverSocketId) {
        // Chỉ gửi thông báo cho đúng người nhận
        io.to(receiverSocketId).emit("userTyping", {
          senderId,
          conversationId,
        });
      }
    });

    // SỰ KIỆN: NGỪNG GÕ PHÍM
    socket.on("stopTyping", ({ senderId, receiverId, conversationId }) => {
      const receiverSocketId = onlineUsers[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("userStopTyping", {
          senderId,
          conversationId,
        });
      }
    });

    socket.on("disconnect", async () => {
      for (const [uid, sid] of Object.entries(onlineUsers)) {
        if (sid === socket.id) {
          delete onlineUsers[uid];
          break;
        }
      }
      // THAY ĐỔI: Gọi hàm lọc thay vì phát trực tiếp
      await broadcastOnlineUsers();
    });
  });
}

function getIO() {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
}

function getOnlineUsers() {
  return onlineUsers;
}

module.exports = { initSocket, getIO, getOnlineUsers };