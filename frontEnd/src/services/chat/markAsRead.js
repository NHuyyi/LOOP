const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export const markAsRead = async (conversationId) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/chat/mark-read/${conversationId}`, {
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
        message: data.message || "Lỗi cập nhật trạng thái đọc",
      };
    }
    return data;
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái đọc:", error);
    return {
      success: false,
      message: "Lỗi server",
    };
  }
};
