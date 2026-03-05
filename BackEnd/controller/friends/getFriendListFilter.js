const User = require(`../../model/User.Model`);
const Conversation = require(`../../model/Conversation.Model`);

// lấy danh sách bạn bè của người dùng với bộ lọc
exports.getFriendListFilter = async (req, res) => {
  try {
    const { userId } = req.body;
    const limit = 10; // số lượng bạn bè muốn lấy

    // tìm các cuộc trò chuyện gần đây nhất của người dùng
    const recentConversations = await Conversation.find({
      participants: userId,
    })
      .sort({ updatedAt: -1 }) // sắp xếp theo thời gian cập nhật gần nhất
      .limit(limit)
      .populate("participants", "name avatar friendCode");

    let filterList = [];

    const addedFriendIds = new Set();

    // 2. Trích xuất thông tin người bạn từ các cuộc trò chuyện
    for (const conv of recentConversations) {
      // Tìm người kia (khác user hiện tại)
      const otherUser = conv.participants.find(
        (p) => p._id.toString() !== userId.toString(),
      );

      if (otherUser && !addedFriendIds.has(otherUser._id.toString())) {
        filterList.push({
          _id: otherUser._id, // ID của người bạn
          name: otherUser.name,
          username: otherUser.username,
          avatar: otherUser.avatar,
          friendCode: otherUser.friendCode,
          conversationId: conv._id, // TRẢ VỀ CẢ CONVERSATION ID
        });
        addedFriendIds.add(otherUser._id.toString());
      }
    }

    if (filterList.length < limit) {
      const currentUser = await User.findById(userId).populate({
        path: "friends",
        select: "name avatar username friendCode",
      });

      if (currentUser && currentUser.friends) {
        // Đảo ngược mảng bạn bè để lấy những người kết bạn gần đây nhất
        const recentFriends = [...currentUser.friends].reverse();

        for (const friend of recentFriends) {
          // Chỉ thêm vào nếu người này chưa có trong danh sách chat ở trên
          if (!addedFriendIds.has(friend._id.toString())) {
            filterList.push({
              _id: friend._id,
              name: friend.name,
              username: friend.username,
              avatar: friend.avatar,
              friendCode: friend.friendCode,
              conversationId: null, // Chưa từng chat nên chưa có ID
            });
            addedFriendIds.add(friend._id.toString());

            // Đủ 10 người thì dừng vòng lặp
            if (filterList.length >= limit) break;
          }
        }
      }
    }

    return res.status(200).json({
      success: true,
      data: filterList, // Trả về mảng 10 người đã được làm phẳng và chuẩn hóa
    });
  } catch (error) {
    console.error("Lỗi lấy danh sách bạn bè", error);
    return res.status(500).json({ message: "Lỗi máy chủ", success: false });
  }
};
