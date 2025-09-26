// controller/postController.js
const PostModel = require("../../model/Post.Model");

exports.getNewsFeed = async (req, res) => {
  try {
    const { friendIds, userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "Cần truyền userId" });
    }

    let ids = [userId, ...(friendIds || [])];

    // lấy tất cả post của chính user + bạn bè
    let posts = await PostModel.find({
      author: { $in: ids },
      isDeleted: { $ne: true },
    })
      .populate("author", "name avatar")
      .populate("comments.user", "_id friends")
      .sort({ createdAt: -1 })
      .lean();

    // lọc post theo visibility
    posts = posts.filter((p) => {
      if (p.visibility === "friends") {
        // bạn bè + chính chủ
        return (
          ids.includes(String(p.author._id)) ||
          String(p.author._id) === String(userId)
        );
      }
      if (p.visibility === "private") {
        // chỉ chính chủ thấy
        return String(p.author._id) === String(userId);
      }
      if (p.visibility === "custom") {
        // nếu user nằm trong denyList => không hiển thị
        return !p.denyList?.map(String).includes(String(userId));
      }
      return true; // fallback (nếu sau này thêm "public")
    });

    // tính lại số lượng comment hiển thị
    const postsWithCount = posts.map((p) => {
      const allComments = p.comments || [];
      const hiddenIds = new Set();

      allComments.forEach((c) => {
        if (String(c.user._id) === String(userId)) return; // chính chủ luôn thấy

        const isFriend = (c.user.friends || [])
          .map(String)
          .includes(String(userId));

        if (!isFriend) {
          hiddenIds.add(String(c._id));
          return;
        }

        // nếu cha bị ẩn thì con cũng ẩn
        if (c.parentId && hiddenIds.has(String(c.parentId))) {
          hiddenIds.add(String(c._id));
        }
      });

      const visibleComments = allComments.filter(
        (c) => !hiddenIds.has(String(c._id)) && !c.isDeleted
      );

      return {
        ...p,
        commentCount: visibleComments.length,
        visibility: p.visibility, // 👈 trả ra FE
      };
    });

    res.json({ success: true, data: postsWithCount });
  } catch (err) {
    console.error("Lỗi getNewsFeed:", err.message);
    res.status(500).json({ error: err.message });
  }
};
