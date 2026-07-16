const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export const toggleMuteConversationAPI = async (conversationId, token) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/chat/toggle-mute/${conversationId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Lỗi thêm reaction tin nhắn",
      };
    }
    return data;
  } catch (error) {
    console.error("Lỗi khi gọi API tắt/bật thông báo:", error);
    throw error;
  }
};
