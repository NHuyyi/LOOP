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
      .populate("comments.user", "friends")
      .sort({ createdAt: -1 })
      .lean();

    const postsWithCount = posts.map((p) => {
      const visibleComments = (p.comments || []).filter((c) => {
        if (!c.user) return false;
        if (String(c.user._id) === String(userId)) return true;
        return c.user.friends.map(String).includes(String(userId));
      });

      const { comments, ...rest } = p;
      return {
        ...rest,
        commentCount: visibleComments.length,
      };
    });

    res.json({ success: true, data: postsWithCount }); // trả đúng dữ liệu
  } catch (err) {
    console.error("Lỗi:", err.message);
    res.status(500).json({ error: err.message });
  }
};
