const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

exports.removeFriend = async (userId, receivedId) => {
  try {
    const res = await fetch(`${API_URL}/friends/removeFriend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ userId, receivedId }),
    });
    const data = await res.json();
    if (!res.ok) {
      return {
        success: data.success,
        status: res.status,
        message: data.message || "Không thể kết bạn",
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      message: "lỗi server",
      error: error,
    };
  }
};
