const PostModel = require("../../model/Post.Model");

exports.addReaction = async (req, res) => {
  try {
    const { postId, userId, reactionType } = req.body; // FE gửi postId + userId + reactionType

    if (!postId || !userId || !reactionType) {
      return res
        .status(400)
        .json({ error: "Cần truyền postId, userId và reactionType" });
    }
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Không tìm thấy bài viết" });
    }
    // Kiểm tra nếu user đã phản ứng trước đó
    const existingReactionIndex = post.reactions.findIndex(
      (reaction) => reaction.user.toString() === userId
    );

    if (existingReactionIndex !== -1) {
      // Cập nhật loại phản ứng nếu đã tồn tại
      post.reactions[existingReactionIndex].type = reactionType;
    } else {
      // Thêm phản ứng mới
      post.reactions.push({ user: userId, type: reactionType });
    }
    await post.save();
    res.json({ success: true, data: post });
  } catch (err) {
    console.error("Lỗi:", err.message);
    res.status(500).json({ error: err.message });
  }
};
