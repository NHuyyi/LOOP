const PostModel = require("../../../model/Post.Model");
const UserModel = require("../../../model/User.Model");
const Block = require("../../../model/Block.Model");
const { getIO, getOnlineUsers } = require("../../../config/socker");
const sanitizeHtml = require("sanitize-html"); // ⚠️ cần cài nếu dùng: npm install sanitize-html

exports.createComment = async (req, res) => {
  try {
    const { postId, text: rawText, parentId } = req.body;
    const userId = req.user.id;

    if (!postId || !rawText || !userId) {
      return res.status(400).json({ error: "Thiếu thông tin" });
    }

    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Không tìm thấy bài viết" });
    }
    // kiểm tra xem có chặn hoặc bị chặn không
    const blockRelation = await Block.findOne({
      $or: [
        { blocker: userId, blocked: post.author },
        { blocker: post.author, blocked: userId },
      ],
    });

    if (blockRelation) {
      return res.status(403).json({
        success: false,
        message:
          String(blockRelation.blocker) === String(userId)
            ? "Bạn đã block người này"
            : "Bạn bị block bởi người này",
      });
    }

    // ✅ Làm sạch nội dung HTML comment (chống XSS)
    const cleanText = sanitizeHtml(rawText, {
      allowedTags: ["b", "i", "em", "strong", "a", "span", "u", "br"],
      allowedAttributes: {
        span: ["class", "style"],
        a: ["href"],
      },
      allowedStyles: {
        "*": {
          // Cho phép màu sắc inline như: style="color:#1877F2;"
          color: [/^#[0-9A-Fa-f]{3,6}$/, /^rgb/, /^rgba/],
        },
      },
    });

    // Tạo comment mới
    const newComment = {
      user: userId,
      text: cleanText, // Lưu HTML
      parentId: parentId || null,
    };

    post.comments.push(newComment);
    await post.save();

    // Lấy lại comment vừa thêm với populate user
    const populated = await PostModel.findById(postId)
      .populate("comments.user", "name avatar friends")
      .lean();

    const created = populated.comments.find(
      (c) =>
        String(c.user._id) === String(userId) &&
        c.text === cleanText &&
        String(c.parentId || "") === String(parentId || ""),
    );

    if (!created) {
      return res.status(500).json({ error: "Không tìm thấy comment vừa tạo" });
    }

    const responseComment = {
      _id: created._id,
      userId: created.user._id,
      name: created.user.name,
      avatar: created.user.avatar,
      text: created.text, // text này là HTML
      parentId: created.parentId,
      createdAt: created.createdAt,
      replies: [],
      reactionCounts: {},
      totalReactions: 0,
    };

    // 🔥 Gửi socket cho bạn bè và chính người tạo
    const commenter = await UserModel.findById(userId).select("friends");
    const allowedUsers = commenter.friends.map((f) => String(f));
    allowedUsers.push(String(userId));

    const io = getIO();
    const onlineUsers = getOnlineUsers();

    Object.entries(onlineUsers).forEach(([uid, socketId]) => {
      if (allowedUsers.includes(uid)) {
        io.to(socketId).emit("createComments", {
          postId,
          comment: responseComment,
        });
      }
    });

    return res.status(201).json({
      success: true,
      comment: responseComment,
    });
  } catch (err) {
    console.error("createComment error:", err);
    res.status(500).json({ error: err.message });
  }
};
