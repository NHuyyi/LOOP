// socket.js
const { Server } = require("socket.io");

let io;
let onlineUsers = {};

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // FE
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("register", (userId) => {
      onlineUsers[userId] = socket.id;

      // phát cho tất cả client danh sách user online
      io.emit("update-online-users", Object.keys(onlineUsers));
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

    socket.on("disconnect", () => {
      for (const [uid, sid] of Object.entries(onlineUsers)) {
        if (sid === socket.id) {
          delete onlineUsers[uid];
          break;
        }
      }
      // phát lại danh sách user online sau khi xóa
      io.emit("update-online-users", Object.keys(onlineUsers));
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
