const PostModel = require("../../model/Post.Model");
const calculateCounts = require("../../utils/reaction");

exports.countReactions = async (req, res) => {
  try {
    const { postId } = req.body; // FE gửi postId
    if (!postId) {
      return res.status(400).json({ error: "Cần truyền postId" });
    }
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Không tìm thấy bài đăng" });
    }

    const { counts, total } = calculateCounts(post.reactions);

    res.json({
      success: true,
      data: { reactionCounts: counts, totalReactions: total },
    });
  } catch (err) {
    console.error("Lỗi:", err.message);
    res.status(500).json({ error: err.message });
  }
};
