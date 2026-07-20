const Block = require("../../model/Block.Model");

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

    const existingBlock = await Block.findOne({
      blocker: currentUserId,
      blocked: targetId,
    });

    if (existingBlock) {
      await Block.deleteOne({
        blocker: currentUserId,
        blocked: targetId,
      });

      return res.status(200).json({
        success: true,
        blocked: false,
        message: "Đã bỏ chặn",
      });
    }

    await Block.create({
      blocker: currentUserId,
      blocked: targetId,
    });

    return res.status(200).json({
      success: true,
      blocked: true,
      message: "Đã chặn người này",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
