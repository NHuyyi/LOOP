const PostModel = require("../../../model/Post.Model");
const UserModel = require("../../../model/User.Model");
const { getIO, getOnlineUsers } = require("../../../config/socker");

exports.deleteComment = async (req, res) => {
  try {
    const { postid, commentid } = req.body;
    const userId = req.user.id;

    if (!postid || !commentid || !userId) {
      return res.status(400).json({ error: "Thiếu thông tin" });
    }

    const post = await PostModel.findById(postid)
      .populate("comments.reactions.user", "avatar name")
      .populate("author", "_id")
      .populate("comments.user", "_id");

    if (!post) {
      return res.status(404).json({ error: "Không tìm thấy bài viết" });
    }

    const comment = post.comments.id(commentid);

    if (!comment) {
      return res.status(404).json({ error: "Không tìm thấy bình luận" });
    }

    if (
      post.author._id.toString() !== userId.toString() &&
      comment.user._id.toString() !== userId.toString()
    ) {
      return res.status(403).json({
        success: false,
        error: "Bạn không có quyền xóa bình luận này",
      });
    }

    (comment.isDeleted = true), await post.save();
    const responseComment = {
      _id: comment._id,
      text: comment.text,
      isDeleted: true,
      parentId: comment.parentId,
    };

    // 🔥 Gửi socket cho bạn bè và chính người tạo
    const postAuthor = await UserModel.findById(post.author._id).select(
      "friends"
    );
    const allowedUsers = (postAuthor.friends || []).map((f) => String(f));
    allowedUsers.push(String(post.author._id));
    allowedUsers.push(String(comment.user._id)); // người viết bình luận
    const io = getIO();
    const onlineUsers = getOnlineUsers();

    Object.entries(onlineUsers).forEach(([uid, socketId]) => {
      if (allowedUsers.includes(uid)) {
        io.to(socketId).emit("Deletecomment", {
          postid,
          comment: responseComment, // chỉ gửi 1 comment mới
        });
      }
    });
    return res.json({ success: true });
  } catch (err) {
    console.error("Lỗi xóa mềm:", err);
    return res.status(500).json({ success: false });
  }
};
