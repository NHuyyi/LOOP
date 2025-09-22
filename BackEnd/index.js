require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connect_DB = require("./config/conect_DB");
const UserRoute = require("./routes/User.Routes");
const { connectCloudinary } = require("./config/Cloudinary");
const PostRoute = require("./routes/post.Routes");
const FriendRoute = require("./routes/Friend.Routes");
const http = require("http"); // thêm http
const { initSocket } = require("./config/socker"); // sửa đường dẫn nếu cần
const { getIO, getOnlineUsers } = require("./config/socker");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Tạo HTTP server từ Express
const server = http.createServer(app);

initSocket(server);

// Khởi động server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});

// Kết nối đến MongoDB
connect_DB();

// kết nối cloudinary
connectCloudinary();

// Gắn các route vào server
app.use("/api/users", UserRoute);
app.use("/api/posts", PostRoute);
app.use("/api/friends", FriendRoute);
// Xuất io & onlineUsers để các controller (removeFriend, sendRequest, …) dùng
module.exports = { getIO, getOnlineUsers };
