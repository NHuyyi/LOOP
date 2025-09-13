const PostModel = require("../../../model/Post.Model");

exports.getCommentsList = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id; // từ middleware Authorization

    // Lấy post + populate user trong comments
    const post = await PostModel.findById(postId).populate(
      "comments.user",
      "name avatar friends"
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy bài đăng",
      });
    }

    // Lọc comment: chỉ hiển thị nếu user là chính chủ hoặc là bạn của người comment
    const visibleComments = post.comments.filter((c) => {
      if (!c.user) return false; // user bị xoá
      if (String(c.user._id) === String(userId)) return true; // chính chủ
      return c.user.friends.includes(userId); // bạn bè
    });

    // Trả về danh sách comment đã lọc + số lượng
    return res.json({
      success: true,
      count: visibleComments.length, // số lượng comment
      data: visibleComments.map((c) => ({
        userId: c.user._id,
        name: c.user.name,
        avatar: c.user.avatar,
        text: c.text,
        createdAt: c.createdAt,
      })),
    });
  } catch (err) {
    console.error("Lỗi getCommentsList:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
