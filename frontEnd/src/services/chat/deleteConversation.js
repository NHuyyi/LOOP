const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export const deleteConversation = async (conversationId) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${API_URL}/chat/delete-conversation/${conversationId}`,
      {
        method: "PUT",
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
        message: data.message || "Lỗi xóa cuộc trò chuyện",
      };
    }

    return data;
  } catch (err) {
    console.error("Lỗi deleteConversation:", err);
    return {
      success: false,
      message: "Lỗi kết nối server",
    };
  }
};
