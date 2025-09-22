// controller/postController.js
const PostModel = require("../../model/Post.Model");

exports.getNewsFeed = async (req, res) => {
  try {
    const { friendIds, userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "Cần truyền userId" });
    }

    let ids = [userId, ...(friendIds || [])];

    const posts = await PostModel.find({ author: { $in: ids } })
      .populate("author", "name avatar")
      .populate("comments.user", "_id friends")
      .sort({ createdAt: -1 })
      .lean();

    const postsWithCount = posts.map((p) => {
      const allComments = p.comments || [];
      const hiddenIds = new Set();

      // duyệt comment để xác định comment ẩn
      allComments.forEach((c) => {
        if (String(c.user._id) === String(userId)) {
          return; // chính chủ luôn hiển thị
        }

        const isFriend = (c.user.friends || [])
          .map(String)
          .includes(String(userId));

        // Nếu không phải bạn bè -> ẩn
        if (!isFriend) {
          hiddenIds.add(String(c._id));
          return;
        }

        // Nếu parent bị ẩn -> ẩn luôn
        if (c.parentId && hiddenIds.has(String(c.parentId))) {
          hiddenIds.add(String(c._id));
        }
      });

      const visibleComments = allComments.filter(
        (c) => !hiddenIds.has(String(c._id)) && !c.isDeleted
      );

      // Tính số lượng comment chưa bị xóa
      const countVisible = visibleComments.length;
      return {
        ...p,
        commentCount: countVisible,
      };
    });

    res.json({ success: true, data: postsWithCount });
  } catch (err) {
    console.error("Lỗi getNewsFeed:", err.message);
    res.status(500).json({ error: err.message });
  }
};
