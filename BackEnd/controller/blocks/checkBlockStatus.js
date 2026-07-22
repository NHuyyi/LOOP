const Block = require("../../model/Block.Model");

exports.checkBlockStatus = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const targetId = req.params.targetId;

    const blockByMe = await Block.findOne({
      blocker: currentUserId,
      blocked: targetId,
    });

    const blockByThem = await Block.findOne({
      blocker: targetId,
      blocked: currentUserId,
    });

    return res.status(200).json({
      success: true,
      isBlockedByMe: !!blockByMe,
      isBlockedByThem: !!blockByThem,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
