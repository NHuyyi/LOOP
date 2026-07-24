// controllers/postController.js
const PostModel = require("../../model/Post.Model");
const UserModel = require("../../model/User.Model");
const { getIO, getOnlineUsers } = require("../../config/socker"); // lấy thêm onlineUsers

exports.NewPost = async (req, res) => {
  try {
    const { imageUrl, content, author, visibility, denyList } = req.body;

    if (!content || !author) {
      return res.status(400).json({
        message: "Vui lòng điền đầy đủ nội dung và tác giả",
        success: false,
      });
    }

    let finalVisibility = visibility || "friends";
    let finalDenyList = [];

    // Custom
    if (finalVisibility === "custom") {
      if (Array.isArray(denyList) && denyList.length > 0) {
        finalDenyList = denyList;
      } else {
        finalVisibility = "friends";
      }
    }

    // Private
    if (finalVisibility === "private") {
      const user = await UserModel.findById(author).select("friends");
      if (user && user.friends) {
        finalDenyList = user.friends.map((f) => f.toString()); // chặn toàn bộ bạn bè
      }
    }

    const newPost = new PostModel({
      imageUrl,
      content,
      author,
      visibility: finalVisibility,
      denyList: finalDenyList,
    });
    await newPost.save();
    await newPost.populate("author", "name avatar");

    // 🔥 Emit realtime theo từng chế độ
    const io = getIO();
    const onlineUsers = getOnlineUsers();

    // Luôn emit cho author nếu online
    if (onlineUsers[author.toString()]) {
      io.to(onlineUsers[author.toString()]).emit("createPost", {
        post: newPost,
      });
    }

    const user = await UserModel.findById(author).select("friends");

    if (finalVisibility === "friends") {
      // Emit cho tất cả bạn bè nếu đang online
      user?.friends?.forEach((friendId) => {
        const socketId = onlineUsers[friendId.toString()];
        if (socketId) {
          io.to(socketId).emit("createPost", { post: newPost });
        }
      });
    } else if (finalVisibility === "custom") {
      // Emit cho bạn bè ngoại trừ denyList
      user?.friends?.forEach((friendId) => {
        if (!finalDenyList.includes(friendId.toString())) {
          const socketId = onlineUsers[friendId.toString()];
          if (socketId) {
            io.to(socketId).emit("createPost", { post: newPost });
          }
        }
      });
    } else if (finalVisibility === "private") {
    }

    return res.status(201).json({
      message: "Tạo bài viết thành công",
      success: true,
      post: newPost,
    });
  } catch (error) {
    console.error("Lỗi tạo bài viết:", error);
    return res.status(500).json({
      message: "Kết nối server bị lỗi",
      success: false,
    });
  }
};
