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

    // Normalize + filter
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
        isDeleted: !!c.isDeleted,
        editedAt: c.editedAt || null,
        isEdited: !!c.isEdited,
      };

      // chỉ thêm nếu parent null hoặc parent đã tồn tại trong map
      if (!normalized.parentId || map.has(normalized.parentId)) {
        map.set(String(c._id), normalized);
      }
    }

    // Hàm sắp xếp replies theo thời gian
    const sortReplies = (arr) => {
      arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      arr.forEach((c) => sortReplies(c.replies));
    };

    // Build tree
    for (const c of map.values()) {
      if (c.parentId && map.has(c.parentId)) {
        map.get(c.parentId).replies.push(c);
      } else {
        roots.push(c);
      }
    }
    // Tính số lượng comment chưa bị xóa
    const visibleComments = comments.filter((c) => canView(c) && !c.isDeleted);
    const countVisible = visibleComments.length;
    sortReplies(roots);

    return res.json({
      success: true,
      count: map.size,
      data: roots,
      count: countVisible,
    });
  } catch (err) {
    console.error("Lỗi getCommentsList:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
