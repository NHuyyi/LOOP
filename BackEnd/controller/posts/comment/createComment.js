const PostModel = require("../../../model/Post.Model");
const UserModel = require("../../../model/User.Model");
const { getIO, getOnlineUsers } = require("../../../config/socker");

exports.createComment = async (req, res) => {
  try {
    const { postId, text, parentId } = req.body;
    const userId = req.user.id;

    if (!postId || !text || !userId) {
      return res.status(400).json({ error: "Thiếu thông tin" });
    }

    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Không tìm thấy bài viết" });
    }

    // Tạo comment mới
    const newComment = {
      user: userId,
      text,
      parentId: parentId || null,
    };
    post.comments.push(newComment);
    await post.save();

    // Lấy lại comment vừa thêm với populate user
    const populated = await PostModel.findById(postId)
      .populate("comments.user", "name avatar friends")
      .lean();

    const created = populated.comments.find(
      (c) =>
        String(c.user._id) === String(userId) &&
        c.text === text &&
        String(c.parentId || "") === String(parentId || "")
    );

    if (!created) {
      return res.status(500).json({ error: "Không tìm thấy comment vừa tạo" });
    }

    const responseComment = {
      _id: created._id,
      userId: created.user._id,
      name: created.user.name,
      avatar: created.user.avatar,
      text: created.text,
      parentId: created.parentId,
      createdAt: created.createdAt,
      replies: [],
      reactionCounts: {},
      totalReactions: 0,
    };

    // 🔥 Gửi socket cho bạn bè và chính người tạo
    const commenter = await UserModel.findById(userId).select("friends");
    const allowedUsers = commenter.friends.map((f) => String(f));
    allowedUsers.push(String(userId));

    const io = getIO();
    const onlineUsers = getOnlineUsers();

    Object.entries(onlineUsers).forEach(([uid, socketId]) => {
      if (allowedUsers.includes(uid)) {
        io.to(socketId).emit("createComments", {
          postId,
          comment: responseComment, // chỉ gửi 1 comment mới
        });
      }
    });

    return res.status(201).json({
      success: true,
      comment: responseComment, // FE sẽ dispatch addComment
    });
  } catch (err) {
    console.error("createComment error:", err);
    res.status(500).json({ error: err.message });
  }
};
