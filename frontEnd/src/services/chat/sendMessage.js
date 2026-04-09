const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export const sendMessage = async (payload) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/chat/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      // Gửi thẳng payload luôn, không cần bọc lại nữa
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Lỗi gửi tin nhắn",
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
