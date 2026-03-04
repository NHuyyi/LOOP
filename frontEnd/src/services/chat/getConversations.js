const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

// lấy danh sách cuộc trò chuyện của người dùng
export const getConversations = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/chat/conversations`, {
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
        message: data.message || ":ỗi lấy danh sách cuộc trò chuyện",
      };
    }
    return data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách cuộc trò chuyện:", error);
    return {
      success: false,
      message: "Lỗi server",
    };
  }
};
