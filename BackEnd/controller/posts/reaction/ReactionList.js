const PostModel = require("../../../model/Post.Model");
const Block = require("../../../model/Block.Model"); // Thêm model Block

exports.getReactionList = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await PostModel.findById(postId).populate(
      "reactions.user",
      "name avatar",
    );

    if (!post) {
      return res
        .status(404)
        .json({ success: false, error: "Không tìm thấy bài đăng" });
    }

    // Lấy danh sách block 2 chiều
    const userBlocks = await Block.find({ blocker: userId }).select("blocked");
    const userBlockedBy = await Block.find({ blocked: userId }).select(
      "blocker",
    );
    const blockedUserIds = new Set([
      ...userBlocks.map((item) => String(item.blocked)),
      ...userBlockedBy.map((item) => String(item.blocker)),
    ]);

    // Lọc và map danh sách trả về
    const validReactions = post.reactions.filter(
      (r) => r.user && !blockedUserIds.has(String(r.user._id)),
    );

    res.json({
      success: true,
      data: validReactions.map((r) => ({
        userId: r.user._id,
        name: r.user.name,
        avatar: r.user.avatar,
        type: r.type,
      })),
    });
  } catch (err) {
    console.error("Lỗi:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};
