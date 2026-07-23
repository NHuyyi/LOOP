const Block = require("../../model/Block.Model");
const Conversation = require("../../model/Conversation.Model");
const { getIO, getOnlineUsers } = require("../../config/socker");

exports.toggleBlockUser = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { targetId } = req.body;

    if (!targetId || String(targetId) === String(currentUserId)) {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu không hợp lệ",
      });
    }

    // Kiểm tra trạng thái hiện tại
    const existingBlock = await Block.findOne({
      blocker: currentUserId,
      blocked: targetId,
    });

    // Nếu đang block -> bỏ block
    if (existingBlock) {
      await Block.deleteOne({
        blocker: currentUserId,
        blocked: targetId,
      });
    } else {
      // Nếu chưa block -> block
      await Block.create({
        blocker: currentUserId,
        blocked: targetId,
      });
    }

    const blockByMe = await Block.findOne({
      blocker: currentUserId,
      blocked: targetId,
    });

    const blockByThem = await Block.findOne({
      blocker: targetId,
      blocked: currentUserId,
    });

    const conversation = await Conversation.findOne({
      participants: { $all: [currentUserId, targetId] },
    })
      .populate("participants", "name avatar")
      .populate("lastMessage");

    const currentUserPayload = {
      isBlockedByMe: !!blockByMe,
      isBlockedByThem: !!blockByThem,
      conversation: conversation,
    };

    const targetUserPayload = {
      isBlockedByMe: !!blockByThem,
      isBlockedByThem: !!blockByMe,
      conversation: conversation,
    };

    const io = getIO();
    const onlineUsers = getOnlineUsers();

    const currentUserSocketId = onlineUsers[currentUserId];
    const targetUserSocketId = onlineUsers[targetId];

    // Gửi trạng thái theo góc nhìn của A
    if (currentUserSocketId) {
      io.to(currentUserSocketId).emit("blockStatusChanged", currentUserPayload);
    }

    // Gửi trạng thái theo góc nhìn của B
    if (targetUserSocketId) {
      io.to(targetUserSocketId).emit("blockStatusChanged", targetUserPayload);
    }

    return res.status(200).json({
      success: true,
      ...currentUserPayload,
      message: blockByMe
        ? "Đã chặn người này"
        : blockByThem
          ? "Đã bỏ chặn, nhưng bạn vẫn bị chặn"
          : "Đã bỏ chặn",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
