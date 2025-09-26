const PostModel = require("../../model/Post.Model");
const UserModel = require("../../model/User.Model");
const { getIO, getOnlineUsers } = require("../../config/socker");

exports.changePostVisibility = async (req, res) => {
  try {
    const { postId, visibility, denyList } = req.body;
    const userId = req.user.id;
    if (!postId || !visibility || !userId) {
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
        .json({ message: "Bạn không có quyền thay đổi bài viết này" });
    }
    // cập nhật chế độ hiển thị
    post.visibility = visibility;
    if (visibility === "custom") {
      post.denyList = denyList || [];
    } else if (visibility === "private") {
      const allFriends = (await UserModel.findById(userId).select("friends"))
        .friends;
      post.denyList = allFriends.map((f) => String(f));
    } else {
      post.denyList = [];
    }

    await post.save();
    const updatedPost = await PostModel.findById(postId).populate(
      "author",
      "name avatar"
    );

    // 🔥 Gửi socket cho bạn bè và chính người tạo
    const postAuthor = await UserModel.findById(userId).select("friends");
    const allowedUsers = postAuthor.friends.map((f) => String(f));
    allowedUsers.push(String(userId));
    const io = getIO();
    const onlineUsers = getOnlineUsers();
    Object.entries(onlineUsers).forEach(([uid, socketId]) => {
      if (allowedUsers.includes(uid)) {
        io.to(socketId).emit("postVisibilityChanged", {
          post: updatedPost,
        });
      }
    });
    res.json({
      success: true,
      message: "Cập nhật chế độ hiển thị thành công",
      post: updatedPost,
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};
