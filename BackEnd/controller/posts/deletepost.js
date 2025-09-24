const PostModel = require("../../model/Post.Model");
const UserModel = require("../../model/User.Model");
const { getIO, getOnlineUsers } = require("../../config/socker");

exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.user.id;

    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        error: "Bạn không có quyền xóa bài viết này",
      });
    }
    post.isDeleted = true;
    await post.save();

    // 🔥 Gửi socket cho bạn bè và chính người tạo
    const postAuthor = await UserModel.findById(post.author).select("friends");
    const allowedUsers = (postAuthor.friends || []).map((f) => String(f));
    allowedUsers.push(String(post.author));
    const io = getIO();
    const onlineUsers = getOnlineUsers();
    Object.entries(onlineUsers).forEach(([uid, socketId]) => {
      if (allowedUsers.includes(uid)) {
        io.to(socketId).emit("Deletepost", {
          postId,
        });
      }
    });
    return res.json({ success: true });
  } catch (err) {
    console.error("Lỗi xóa mềm:", err);
    return res.status(500).json({ success: false });
  }
};
