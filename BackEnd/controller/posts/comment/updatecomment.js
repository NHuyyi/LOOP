const PostModel = require("../../../model/Post.Model");
const UserModel = require("../../../model/User.Model");
const { getIO, getOnlineUsers } = require("../../../config/socker");

exports.updateComment = async (req, res) => {
  try {
    const { postId, commentId, newtext } = req.body;
    const userId = req.user.id;

    if (!postId || !commentId || !newtext) {
      return res.status(400).json({ error: "Thiếu thông tin" });
    }

    // tìm post
    const post = await PostModel.findById(postId);
    if (!post)
      return res.status(404).json({ message: "Không tìm thấy bài viết" });

    // tìm comments
    const comment = post.comments.id(commentId);
    if (!comment)
      return res.status(404).json({ message: "Không tìm thấy bình luận" });

    // kiểm tra bạn có phải người bình luận không
    if (comment.user.toString() !== userId)
      return res
        .status(403)
        .json({ message: "Bạn không có quyền sửa bình luận" });

    // cập nhật nội dung
    comment.text = newtext;
    comment.isEdited = true;
    comment.editedAt = new Date();
    await post.save();

    // 🔥 Gửi socket cho bạn bè và chính người tạo
    const commenter = await UserModel.findById(userId).select("friends");
    const allowedUsers = commenter.friends.map((f) => String(f));
    allowedUsers.push(String(userId));

    const io = getIO();
    const onlineUsers = getOnlineUsers();

    Object.entries(onlineUsers).forEach(([uid, socketId]) => {
      if (allowedUsers.includes(uid)) {
        io.to(socketId).emit("commentUpdated", {
          postId,
          comment: comment, // chỉ gửi 1 comment mới
        });
      }
    });

    res.json({
      success: true,
      message: "Cập nhật bình luận thành công",
      comment,
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};
