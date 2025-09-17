// controller/post/getCommentsList.js
const PostModel = require("../../../model/Post.Model");
const calculateCounts = require("../../../utils/reaction");

exports.getCommentsList = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id; // lấy từ middleware Authorization

    // Lấy post + populate user trong comments (để có name, avatar, friends)
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

    // Hàm kiểm tra quyền xem comment
    const canView = (c) => {
      if (!c.user) return false;
      if (String(c.user._id) === String(userId)) return true;
      const friends = Array.isArray(c.user.friends)
        ? c.user.friends.map(String)
        : [];
      return friends.includes(String(userId));
    };

    // Gom con theo parentId
    const childrenMap = new Map();
    for (const c of comments) {
      const pid = c.parentId ? String(c.parentId) : "root";
      if (!childrenMap.has(pid)) childrenMap.set(pid, []);
      childrenMap.get(pid).push(c);
    }

    // Bắt đầu từ comment gốc (parentId = null)
    const roots = childrenMap.get("root") || [];

    // BFS để duyệt — chỉ thêm con nếu cha visible
    const visible = [];
    const queue = [...roots];

    while (queue.length) {
      const node = queue.shift();

      if (!canView(node)) {
        // nếu cha không visible → bỏ luôn cả nhánh con
        continue;
      }

      visible.push(node);

      // duyệt con của node này
      const kids = childrenMap.get(String(node._id)) || [];
      for (const ch of kids) {
        queue.push(ch);
      }
    }

    // Chuẩn hoá dữ liệu trả về (mảng phẳng, có parentId)
    const data = visible.map((c) => {
      const { counts, total } = calculateCounts(c.reactions || []);
      return {
        _id: c._id,
        userId: c.user._id,
        name: c.user.name,
        avatar: c.user.avatar,
        text: c.text,
        parentId: c.parentId || null,
        reactions: c.reactions || [],
        reactionCounts: counts,
        totalReactions: total,
        createdAt: c.createdAt,
      };
    });

    return res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    console.error("Lỗi getCommentsList:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
