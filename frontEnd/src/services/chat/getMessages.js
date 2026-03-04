const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export const getMessages = async (conversationId, page = 1) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${API_URL}/chat/messages/${conversationId}?page=${page}`,
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
        message: data.message || "Lỗi lấy tin nhắn",
      };
    }
    return data;
  } catch (error) {
    console.error("Lỗi khi lấy tin nhắn:", error);
    return {
      success: false,
      message: "Lỗi server",
    };
  }
};
