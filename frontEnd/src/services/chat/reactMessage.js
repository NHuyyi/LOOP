const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export const reactMessage = async (messageId, type) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/chat/react`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        messageId,
        type,
      }),
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
    console.error("Lỗi khi gửi tin nhắn:", error);
    return {
      success: false,
      message: "Lỗi server",
    };
  }
};
