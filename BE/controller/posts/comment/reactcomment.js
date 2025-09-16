const PostModel = require("../../../model/Post.Model");
const { getIO, getOnlineUsers } = require("../../../config/socker");
const calculateCounts = require("../../../utils/reaction");

exports.reactComment = async (req, res) => {
  try {
    const { postId, userId, commentId, reactionType } = req.body;

    if (!postId || !userId || !commentId || !reactionType) {
      return res
        .status(400)
        .json({ error: "Cần truyền các dữ liệu cần thiết" });
    }
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "không tìm thấy bài viết" });
    }
    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ error: "không tìm thấy bình luận" });
    }
    // kiểm tra nếu user đã phản ứng trước đó
    const existingReactionIndex = comment.reactions.findIndex(
      (r) => r.user.toString() === userId
    );
    // findIndex là tìm vị trí theo điều kiện
    if (existingReactionIndex !== -1) {
      // cập nhật loại phản ứng nếu đã tồn tại
      const existingType = comment.reactions[existingReactionIndex].type;
      if (existingType === reactionType) {
        // nếu người dùng nhấp 2 lần vào cùng 1 kiểu react thì sẽ xóa reaction
        comment.reactions.splice(existingReactionIndex, 1);
        // splice(A,1) xóa vị trí số 1 trong mảng A
      } else {
        // nếu khác loại thì cập nhật lại
        comment.reactions[existingReactionIndex].type = reactionType;
      }
    } else {
      // nếu giờ chưa có react thì thêm mới
      comment.reactions.push({ user: userId, type: reactionType });
    }
    await post.save();
    const { counts, total } = calculateCounts(comment.reactions);

    const io = getIO();
    const onlineUsers = getOnlineUsers();

    // gửi event cho tất cả user online
    Object.values(onlineUsers).forEach((socketId) => {
      io.to(socketId).emit("UpdateReactComment", {
        postId,
        commentId,
        reactionCounts: counts,
        totalReactions: total,
      });
    });
    // onlineUsers: đây là giá trị dùng để lọc
    // socketId: danh sách lọc
    // io.to(socketId).emit("UpdateReactComment", {
    //     postId,
    //     commentId,
    //     reactionCounts: counts,
    //     totalReactions: total,
    //   });
    // đây là nội dung được gửi đi
    res.json({ success: true, data: post });
  } catch (err) {
    console.error("Lỗi:", err.message);
    res.status(500).json({ error: err.message });
  }
};
