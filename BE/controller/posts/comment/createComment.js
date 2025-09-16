const PostModel = require("../../../model/Post.Model");
const UserModel = require("../../../model/User.Model");
const { getIO, getOnlineUsers } = require("../../../config/socker");

exports.createComment = async (req, res) => {
  try {
    const { postId, text, parentId } = req.body; // ⚡ thêm parentId
    const userId = req.user.id;

    if (!postId || !text || !userId) {
      return res.status(400).json({ error: "Thiếu thông tin" });
    }

    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Không tìm thấy bài viết" });
    }

    // thêm comment hoặc reply
    const newComment = {
      user: userId,
      text,
      parentId: parentId || null,
    };
    post.comments.push(newComment);
    await post.save();

    // populate lại để lấy info user
    await post.populate("comments.user", "name avatar friends");

    // map lại comments (phẳng)
    const allComments = post.comments.map((c) => ({
      _id: c._id,
      userId: c.user._id,
      name: c.user.name,
      avatar: c.user.avatar,
      text: c.text,
      parentId: c.parentId,
      createdAt: c.createdAt,
    }));

    // lọc người được phép nhận socket event
    const commenter = await UserModel.findById(userId).select("friends");
    const allowedUsers = commenter.friends.map((f) => String(f));
    allowedUsers.push(String(userId));

    const io = getIO();
    const onlineUsers = getOnlineUsers();

    Object.entries(onlineUsers).forEach(([uid, socketId]) => {
      if (allowedUsers.includes(uid)) {
        io.to(socketId).emit("createComments", {
          postId,
          comments: allComments,
          commentsCount: allComments.length,
        });
      }
    });

    res.status(201).json({
      success: true,
      comments: allComments,
      commentsCount: allComments.length,
    });
  } catch (err) {
    console.error("createComment error:", err);
    res.status(500).json({ error: err.message });
  }
};
