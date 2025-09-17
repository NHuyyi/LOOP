// controller/post/getCommentsList.js
const PostModel = require("../../../model/Post.Model");
const calculateCounts = require("../../../utils/reaction");

exports.getCommentsList = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await PostModel.findById(postId)
      .populate("comments.user", "name avatar friends")
      .lean();

    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy bài đăng",
      });
    }

    const comments = Array.isArray(post.comments) ? post.comments : [];

    // Hàm kiểm tra quyền xem
    const canView = (c) => {
      if (!c.user) return false;
      if (String(c.user._id) === String(userId)) return true;
      const friends = Array.isArray(c.user.friends)
        ? c.user.friends.map(String)
        : [];
      return friends.includes(String(userId));
    };

    const map = new Map();
    const roots = [];

    // Chỉ 1 vòng duyệt: normalize + build map
    for (const c of comments) {
      if (!canView(c)) continue;

      const { counts, total } = calculateCounts(c.reactions || []);

      const normalized = {
        _id: c._id,
        userId: c.user._id,
        name: c.user.name,
        avatar: c.user.avatar,
        text: c.text,
        parentId: c.parentId ? String(c.parentId) : null,
        reactions: c.reactions || [],
        reactionCounts: counts,
        totalReactions: total,
        createdAt: c.createdAt,
        replies: [],
      };

      map.set(String(c._id), normalized);
    }

    // Nối parent–child
    for (const c of map.values()) {
      if (c.parentId && map.has(c.parentId)) {
        map.get(c.parentId).replies.push(c);
      } else {
        roots.push(c);
      }
    }

    // Sắp xếp replies theo thời gian nếu cần
    const sortReplies = (arr) => {
      arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      arr.forEach((c) => sortReplies(c.replies));
    };
    sortReplies(roots);

    return res.json({
      success: true,
      count: map.size,
      data: roots,
    });
  } catch (err) {
    console.error("Lỗi getCommentsList:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
