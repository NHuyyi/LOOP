const Conversation = require("../../../model/Conversation.Model");

const toggleMuteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id; // Lấy ID người dùng hiện tại từ middleware authorize

    // 1. Tìm cuộc trò chuyện
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy cuộc trò chuyện" });
    }

    // 2. Bảo mật: Kiểm tra xem user có phải là thành viên của cuộc trò chuyện này không
    if (!conversation.participants.includes(userId)) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền thực hiện thao tác này" });
    }

    // 3. Kiểm tra xem người dùng đã tắt thông báo chưa
    const isMuted = conversation.mutedBy.includes(userId);

    if (isMuted) {
      // Nếu đã tắt -> Bật lại (xóa ID khỏi mảng mutedBy)
      conversation.mutedBy.pull(userId);
    } else {
      // Nếu chưa tắt -> Tắt thông báo (thêm ID vào mảng mutedBy)
      conversation.mutedBy.push(userId);
    }

    // 4. Lưu lại thay đổi
    await conversation.save();

    // 5. Trả về kết quả cho Frontend
    return res.status(200).json({
      success: true,
      message: isMuted ? "Đã bật thông báo" : "Đã tắt thông báo",
      isMuted: !isMuted, // Trả về trạng thái hiện tại để FE dễ update UI
    });
  } catch (error) {
    console.error("Lỗi toggle mute conversation:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = { toggleMuteConversation };
