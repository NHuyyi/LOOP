const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export const deleteMessage = async (messageId) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/chat/delete-message/${messageId}`, {
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
        message: data.message || "Lỗi xóa tin nhắn",
      };
    }
    return data;
  } catch (error) {
    console.error("Lỗi khi xóa tin nhắn:", error);
    return {
      success: false,
      message: "Lỗi server",
    };
  }
};
