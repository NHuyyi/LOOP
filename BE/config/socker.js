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
