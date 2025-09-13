// controllers/GetReactionList.js
const PostModel = require("../../../model/Post.Model");

exports.getReactionList = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id; // từ middleware Authorization

    const post = await PostModel.findById(postId).populate(
      "reactions.user",
      "name avatar"
    ); // 👈 dùng "user" thay vì "userId"

    if (!post) {
      return res
        .status(404)
        .json({ success: false, error: "Không tìm thấy bài đăng" });
    }
    // 🔑 chỉ cho phép author xem danh sách
    if (post.author._id.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        error: "Bạn không có quyền xem danh sách này",
      });
    }

    res.json({
      success: true,
      data: post.reactions.map((r) => ({
        userId: r.user._id,
        name: r.user.name,
        avatar: r.user.avatar,
        type: r.type,
      })),
    });
  } catch (err) {
    console.error("Lỗi:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};
