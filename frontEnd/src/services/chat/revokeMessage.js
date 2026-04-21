const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export const revokeMessage = async (messageId) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/chat/revoke-message/${messageId}`, {
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
        message: data.message || "Lỗi thu hồi tin nhắn",
      };
    }
    return data;
  } catch (error) {
    console.error("Lỗi khi thu hồi tin nhắn:", error);
    return {
      success: false,
      message: "Lỗi server",
    };
  }
};
