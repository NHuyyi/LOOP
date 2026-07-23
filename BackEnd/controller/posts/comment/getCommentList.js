// controller/post/getCommentsList.js
const PostModel = require("../../../model/Post.Model");
const Block = require("../../../model/Block.Model");
const calculateCounts = require("../../../utils/reaction");

exports.getCommentsList = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    // ==========================================
    // 1. LẤY POST
    // ==========================================
    const post = await PostModel.findById(postId)
      .populate("comments.user", "name avatar friends")
      .lean();

    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy bài đăng",
      });
    }

    // ==========================================
    // 2. LẤY BLOCK 2 CHIỀU
    // ==========================================
    const userBlocks = await Block.find({
      blocker: userId,
    }).select("blocked");

    const userBlockedBy = await Block.find({
      blocked: userId,
    }).select("blocker");

    const blockedUserIds = new Set([
      ...userBlocks.map((item) => String(item.blocked)),
      ...userBlockedBy.map((item) => String(item.blocker)),
    ]);

    const comments = Array.isArray(post.comments) ? post.comments : [];

    // ==========================================
    // 3. KIỂM TRA COMMENT CÓ ĐƯỢC XEM TRỰC TIẾP
    // ==========================================
    const canView = (c) => {
      // Không có user
      if (!c.user) {
        return false;
      }

      // Comment của chính mình
      if (String(c.user._id) === String(userId)) {
        return true;
      }

      // User bị block hoặc block ngược lại
      if (blockedUserIds.has(String(c.user._id))) {
        return false;
      }

      // Chỉ bạn bè mới được xem
      const friends = Array.isArray(c.user.friends)
        ? c.user.friends.map(String)
        : [];

      return friends.includes(String(userId));
    };

    // ==========================================
    // 4. XÁC ĐỊNH COMMENT BỊ HIDDEN
    // ==========================================
    const hiddenIds = new Set();

    // ------------------------------------------
    // 4.1 HIDDEN TRỰC TIẾP
    // ------------------------------------------
    for (const c of comments) {
      if (!canView(c)) {
        hiddenIds.add(String(c._id));
      }
    }

    // ------------------------------------------
    // 4.2 CASCADE HIDDEN THEO PARENT
    // ------------------------------------------
    // Nếu parent bị hidden vì block/quyền xem
    // thì toàn bộ descendants cũng hidden.
    //
    // LƯU Ý:
    // isDeleted KHÔNG được thêm vào hiddenIds.
    //
    let changed = true;

    while (changed) {
      changed = false;

      for (const c of comments) {
        if (
          c.parentId &&
          hiddenIds.has(String(c.parentId)) &&
          !hiddenIds.has(String(c._id))
        ) {
          hiddenIds.add(String(c._id));

          changed = true;
        }
      }
    }

    // ==========================================
    // 5. COMMENT VISIBLE
    // ==========================================
    // hidden:
    //   → không trả về
    //   → không tính
    //
    // isDeleted:
    //   → vẫn trả về để giữ cấu trúc cây
    //   → không tính
    //
    // normal:
    //   → trả về
    //   → tính
    const visibleComments = comments.filter((c) => {
      return !hiddenIds.has(String(c._id));
    });

    // ==========================================
    // 6. TẠO MAP
    // ==========================================
    const map = new Map();

    for (const c of visibleComments) {
      // ----------------------------------------
      // LỌC REACTION CỦA USER BỊ BLOCK
      // ----------------------------------------
      const reactionin = Array.isArray(c.reactions)
        ? c.reactions.filter(
            (r) => !blockedUserIds.has(String(r.user?._id || r.user)),
          )
        : [];

      const { counts, total } = calculateCounts(reactionin);

      // ----------------------------------------
      // NORMALIZE
      // ----------------------------------------
      const normalized = {
        _id: c._id,

        userId: c.user?._id || null,

        name: c.user?.name || "Người dùng",

        avatar: c.user?.avatar || null,

        text: c.text,

        parentId: c.parentId ? String(c.parentId) : null,

        reactions: reactionin,

        reactionCounts: counts,

        totalReactions: total,

        createdAt: c.createdAt,

        replies: [],

        // GIỮ LẠI NODE DELETED
        // để chứa replies
        isDeleted: !!c.isDeleted,

        editedAt: c.editedAt || null,

        isEdited: !!c.isEdited,
      };

      map.set(String(c._id), normalized);
    }

    // ==========================================
    // 7. BUILD TREE
    // ==========================================
    const roots = [];

    for (const c of map.values()) {
      // Parent tồn tại trong cây
      if (c.parentId && map.has(c.parentId)) {
        map.get(c.parentId).replies.push(c);
      } else {
        // Parent không tồn tại vì:
        // - parent không visible
        //
        // Nhưng trường hợp này về nguyên tắc
        // đã được cascade hidden ở bước trên.
        //
        // Giữ fallback để không làm mất dữ liệu.
        roots.push(c);
      }
    }

    // ==========================================
    // 8. SORT REPLIES
    // ==========================================
    const sortReplies = (arr) => {
      arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      arr.forEach((c) => {
        sortReplies(c.replies);
      });
    };

    sortReplies(roots);

    // ==========================================
    // 9. TÍNH COUNT
    // ==========================================
    // Chỉ comment không bị xóa mới tính.
    //
    // Comment deleted vẫn nằm trong `data`
    // nhưng không tính vào count.
    //
    // Hidden đã bị loại khỏi visibleComments
    // nên cũng không tính.
    const countVisible = visibleComments.filter((c) => !c.isDeleted).length;

    // ==========================================
    // 10. RESPONSE
    // ==========================================
    return res.json({
      success: true,
      data: roots,
      count: countVisible,
    });
  } catch (err) {
    console.error("Lỗi getCommentsList:", err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
