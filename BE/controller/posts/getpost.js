// controller/postController.js
const PostModel = require("../../model/Post.Model");

exports.getNewsFeed = async (req, res) => {
  try {
    const { friendIds, userId } = req.body; // FE gửi friendIds + userId

    if (!userId) {
      return res.status(400).json({ error: "Cần truyền userId" });
    }

    let ids = [userId, ...(friendIds || [])];

    const posts = await PostModel.find({ author: { $in: ids } })
      .populate("author", "name avatar")
      .populate("comments.user", "name avatar")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: posts });
  } catch (err) {
    console.error("Lỗi:", err.message);
    res.status(500).json({ error: err.message });
  }
};
