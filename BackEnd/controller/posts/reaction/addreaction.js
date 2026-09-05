const PostModel = require("../../../model/Post.Model");
const UserModel = require("../../../model/User.Model");
const { getIO, getOnlineUsers } = require("../../../config/socker");
const calculateCounts = require("../../../utils/reaction");
const { completeTaskForUser } = require("../../../utils/streakHelper");
const sendPushNotification = require("../../../utils/sendPushNotification");
exports.addReaction = async (req, res) => {
  try {
    const { postId, userId, reactionType } = req.body; // FE gửi postId + userId + reactionType

    if (!postId || !userId || !reactionType) {
      return res
        .status(400)
        .json({ error: "Cần truyền postId, userId và reactionType" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Không tìm thấy user" });
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
      const existingType = post.reactions[existingReactionIndex].type;
      if (existingType === reactionType) {
        // 👉 Nếu user click lại cùng 1 reaction => xóa reaction
        post.reactions.splice(existingReactionIndex, 1);
      } else {
        // 👉 Nếu khác loại => update reaction
        post.reactions[existingReactionIndex].type = reactionType;
      }
    } else {
      // Thêm phản ứng mới
      post.reactions.push({ user: userId, type: reactionType });
    }
    await post.save();

    // ── Streak auto-completion ──
    // Task 3: React bài viết của bạn bè (10 điểm)
    // Note: We might just give it for any reaction as simplified version or check if post.author is friend. 
    // Simplified to any post reaction for now.
    completeTaskForUser(userId, 3).catch(() => { });

    const { counts, total } = calculateCounts(post.reactions);

    const io = getIO();
    const onlineUsers = getOnlineUsers();

    // Gửi event cho tất cả user online (hoặc lọc user liên quan)
    Object.values(onlineUsers).forEach((socketId) => {
      io.to(socketId).emit("reactionUpdated", {
        post,
        reactionCounts: counts,
        totalReactions: total,
      });
    });
    // Đặt sau khi lưu reaction thành công
    if (!onlineUsers[post.author]) {
      await sendPushNotification(
        post.author,
        "Cảm xúc mới",
        `${user.name} đã bày tỏ cảm xúc về bài viết của bạn`,
        `/post/${postId}` // <--- Dẫn thẳng vào bài viết
      );
    }
    res.json({
      success: true,
      data: {
        post, // GIỮ LẠI DANH SÁCH CHI TIẾT
      },
    });
  } catch (err) {
    console.error("Lỗi:", err.message);
    res.status(500).json({ error: err.message });
  }
};
