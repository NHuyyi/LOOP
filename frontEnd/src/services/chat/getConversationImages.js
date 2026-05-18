const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export const getConversationImages = async (conversationId) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${API_URL}/chat/conversation-images/${conversationId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Lỗi khi lấy ảnh từ cuộc trò chuyện",
      };
    }
    return data;
  } catch (err) {
    console.error("Lỗi khi lấy ảnh từ cuộc trò chuyện:", err);
    return {
      success: false,
      message: "Lỗi khi lấy ảnh từ cuộc trò chuyện",
    };
  }
};
