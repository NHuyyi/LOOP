const PostModel = require("../../../model/Post.Model");
const { getIO, getOnlineUsers } = require("../../../config/socker");

exports.createComment = async (req, res) => {
  try {
    const { postId, text } = req.body;
    const userId = req.user.id;

    if (!postId || !text || !userId) {
      return res
        .status(400)
        .json({ error: "Thong tin bị thiếu vui lòng kiểm tra lại" });
    }
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(400).json({ error: "không tìm thất bài viết" });
    }

    const newcomment = {
      user: userId,
      text,
    };

    post.comments.push(newcomment);
    await post.save();

    // dùng populate để trả vể tên và ảnh đại diện của người gửi
    await post.populate("comments.user", "name avatar");

    const io = getIO();
    const onlineUsers = getOnlineUsers();

    // Gửi event cho tất cả user online (hoặc lọc user liên quan)
    Object.values(onlineUsers).forEach((socketId) => {
      io.to(socketId).emit("createComments", {
        postId,
        comments: post.comments,
      });
    });
    res.status(201).json({
      comments: post.comments,
      message: "Thêm bình luận thành công",
    });
  } catch (err) {
    console.error(err); // in chi tiết ra console BE
    res.status(500).json({
      error: err.message,
    });
  }
};
