const PostModel = require("../../../model/Post.Model");

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
    await post.save();

    res.json({
      message: "Cập nhật bình luận thành công",
      comment,
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};
