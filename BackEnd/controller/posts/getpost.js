// controller/postController.js
const PostModel = require("../../model/Post.Model");
const UserModel = require("../../model/User.Model");

exports.getNewsFeed = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "Cần truyền userId" });
    }

    // 🔹 Lấy danh sách bạn bè từ DB
    const user = await UserModel.findById(userId).populate("friends", "_id");
    if (!user) {
      return res.status(404).json({ error: "User không tồn tại" });
    }

    const friendIds = user.friends.map((f) => String(f._id));
    const ids = [String(userId), ...friendIds];

    // 🔹 Lấy post của chính user + bạn bè
    let posts = await PostModel.find({
      author: { $in: ids },
      isDeleted: { $ne: true },
    })
      .populate("author", "name avatar")
      .populate("comments.user", "_id friends")
      .sort({ createdAt: -1 })
      .lean();

    // 🔹 Lọc theo visibility
    posts = posts.filter((p) => {
      if (p.visibility === "friends") {
        return ids.includes(String(p.author._id));
      }
      if (p.visibility === "private") {
        return String(p.author._id) === String(userId);
      }
      if (p.visibility === "custom") {
        return !p.denyList?.map(String).includes(String(userId));
      }
      return true; // public
    });

    // 🔹 Tính số comment hiển thị
    const postsWithCount = posts.map((p) => {
      const allComments = p.comments || [];
      const hiddenIds = new Set();

      allComments.forEach((c) => {
        if (String(c.user._id) === String(userId)) return; // chính chủ thấy

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
        visibility: p.visibility,
      };
    });

    res.json({ success: true, data: postsWithCount });
  } catch (err) {
    console.error("Lỗi getNewsFeed:", err.message);
    res.status(500).json({ error: err.message });
  }
};
