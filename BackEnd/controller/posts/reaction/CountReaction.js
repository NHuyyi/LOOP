const PostModel = require("../../../model/Post.Model");
const Block = require("../../../model/Block.Model"); // Thêm dòng này
const calculateCounts = require("../../../utils/reaction");

exports.countReactions = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.user.id; // Lấy ID của người đang xem

    if (!postId) {
      return res.status(400).json({ error: "Cần truyền postId" });
    }
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Không tìm thấy bài đăng" });
    }

    // 1. Lấy danh sách block 2 chiều
    const userBlocks = await Block.find({ blocker: userId }).select("blocked");
    const userBlockedBy = await Block.find({ blocked: userId }).select(
      "blocker",
    );
    const blockedUserIds = new Set([
      ...userBlocks.map((item) => String(item.blocked)),
      ...userBlockedBy.map((item) => String(item.blocker)),
    ]);

    // 2. Lọc bỏ reaction của những người nằm trong danh sách block
    const validReactions = post.reactions.filter(
      (r) => !blockedUserIds.has(String(r.user)),
    );

    // 3. Đếm dựa trên danh sách đã lọc
    const { counts, total } = calculateCounts(validReactions);

    res.json({
      success: true,
      data: { reactionCounts: counts, totalReactions: total },
    });
  } catch (err) {
    console.error("Lỗi:", err.message);
    res.status(500).json({ error: err.message });
  }
};
