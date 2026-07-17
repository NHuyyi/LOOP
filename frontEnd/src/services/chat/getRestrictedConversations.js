const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export const getRestrictedConversations = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/chat/restricted-conversations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Lỗi lấy cuộc trò chuyện hạn chế",
      };
    }
    return data;
  } catch (error) {
    console.error("Lỗi getRestrictedConversations:", error);
    return { success: false, message: "Lỗi server" };
  }
};
