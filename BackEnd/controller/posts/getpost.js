// controller/postController.js
const PostModel = require("../../model/Post.Model");
const UserModel = require("../../model/User.Model");
const Block = require("../../model/Block.Model");

exports.getNewsFeed = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: "Cần truyền userId",
      });
    }

    // ==========================================
    // 1. LẤY THÔNG TIN USER + DANH SÁCH BẠN BÈ
    // ==========================================
    const user = await UserModel.findById(userId).populate("friends", "_id");

    if (!user) {
      return res.status(404).json({
        error: "User không tồn tại",
      });
    }

    const friendIds = user.friends.map((f) => String(f._id));

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

    // ==========================================
    // 3. USER IDS ĐƯỢC XEM NEWS FEED
    // ==========================================
    const ids = [String(userId), ...friendIds];

    // ==========================================
    // 4. LẤY POST
    // ==========================================
    let posts = await PostModel.find({
      author: {
        $in: ids,
      },
      isDeleted: {
        $ne: true,
      },
    })
      .populate("author", "name avatar")
      .populate("comments.user", "_id friends")
      .sort({
        createdAt: -1,
      })
      .lean();

    // ==========================================
    // 5. LỌC POST THEO BLOCK + VISIBILITY
    // ==========================================
    posts = posts.filter((p) => {
      // Author bị block hoặc block ngược lại
      if (blockedUserIds.has(String(p.author._id))) {
        return false;
      }

      // Friends
      if (p.visibility === "friends") {
        return ids.includes(String(p.author._id));
      }

      // Private
      if (p.visibility === "private") {
        return String(p.author._id) === String(userId);
      }

      // Custom
      if (p.visibility === "custom") {
        return !p.denyList?.map(String).includes(String(userId));
      }

      // Public
      return true;
    });

    // ==========================================
    // 6. TÍNH COMMENT COUNT
    // ==========================================
    const postsWithCount = posts.map((p) => {
      const allComments = Array.isArray(p.comments) ? p.comments : [];

      // ========================================
      // 6.1 XÁC ĐỊNH COMMENT BỊ HIDDEN TRỰC TIẾP
      // ========================================
      const hiddenIds = new Set();

      for (const c of allComments) {
        // Comment không có user
        if (!c.user) {
          hiddenIds.add(String(c._id));
          continue;
        }

        // Comment của chính user
        // luôn được phép xem
        if (String(c.user._id) === String(userId)) {
          continue;
        }

        // User của comment bị block
        if (blockedUserIds.has(String(c.user._id))) {
          hiddenIds.add(String(c._id));
          continue;
        }

        // Chỉ bạn bè mới xem được comment
        const isFriend = (c.user.friends || [])
          .map(String)
          .includes(String(userId));

        if (!isFriend) {
          hiddenIds.add(String(c._id));
        }
      }

      // ========================================
      // 6.2 CASCADE HIDDEN TỪ CHA XUỐNG CON
      // ========================================
      // Nếu parent bị hidden thì toàn bộ
      // descendants cũng bị hidden.
      //
      // isDeleted KHÔNG được thêm vào hiddenIds.
      // Vì comment bị xóa vẫn giữ node để chứa replies.
      //
      let changed = true;

      while (changed) {
        changed = false;

        for (const c of allComments) {
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

      // ========================================
      // 6.3 COMMENT VISIBLE
      // ========================================
      // hidden → không tính
      // isDeleted → không tính
      // bình thường → tính
      const visibleComments = allComments.filter((c) => {
        return !hiddenIds.has(String(c._id)) && !c.isDeleted;
      });

      return {
        ...p,

        commentCount: visibleComments.length,

        visibility: p.visibility,
      };
    });

    // ==========================================
    // 7. RESPONSE
    // ==========================================
    return res.json({
      success: true,
      data: postsWithCount,
    });
  } catch (err) {
    console.error("Lỗi getNewsFeed:", err.message);

    return res.status(500).json({
      error: err.message,
    });
  }
};
