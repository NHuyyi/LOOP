const PostModel = require("../../../model/Post.Model");
const UserModel = require("../../../model/User.Model");
const { getIO, getOnlineUsers } = require("../../../config/socker");

exports.createComment = async (req, res) => {
  try {
    const { postId, text } = req.body;
    const userId = req.user.id;

    if (!postId || !text || !userId) {
      return res.status(400).json({ error: "Thông tin bị thiếu" });
    }

    const post = await PostModel.findById(postId).populate(
      "comments.user",
      "name avatar friends"
    );

    if (!post)
      return res.status(404).json({ error: "Không tìm thấy bài viết" });

    post.comments.push({ user: userId, text });
    await post.save();
    await post.populate("comments.user", "name avatar friends");

    const allComments = post.comments.map((c) => ({
      userId: c.user._id,
      name: c.user.name,
      avatar: c.user.avatar,
      text: c.text,
      createdAt: c.createdAt,
    }));

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
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
