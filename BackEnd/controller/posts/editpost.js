const PostModel = require("../../model/Post.Model");
const UserModel = require("../../model/User.Model");
const { getIO, getOnlineUsers } = require("../../config/socker");

exports.editPost = async (req, res) => {
  try {
    const { postId, newContent } = req.body;
    const userId = req.user.id;

    if (!postId || !newContent || !userId) {
      return res.status(400).json({ error: "Thiếu thông tin" });
    }

    // tìm post
    const post = await PostModel.findById(postId);
    if (!post)
      return res.status(404).json({ message: "Không tìm thấy bài viết" });

    // kiểm tra bạn có phải người tạo post không
    if (post.author.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền sửa bài viết này" });
    }

    // cập nhật nội dung
    post.content = newContent;
    post.isEdited = true;
    post.editedAt = new Date();
    await post.save();

    // 🔥 Gửi socket cho bạn bè và chính người tạo
    const postAuthor = await UserModel.findById(userId).select("friends");
    const allowedUsers = postAuthor.friends.map((f) => String(f));
    allowedUsers.push(String(userId));

    const io = getIO();
    const onlineUsers = getOnlineUsers();

    Object.entries(onlineUsers).forEach(([uid, socketId]) => {
      if (allowedUsers.includes(uid)) {
        io.to(socketId).emit("postEdited", {
          post,
        });
      }
    });
    res.json({ success: true, message: "Cập nhật bài viết thành công", post });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};
