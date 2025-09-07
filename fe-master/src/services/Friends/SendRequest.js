const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

exports.sendRequest = async (senderId, receivedId) => {
  try {
    const res = await fetch(`${API_URL}/friends/sendRequest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ senderId, receivedId }),
    });
    const data = await res.json();
    if (!res.ok) {
      return {
        success: data.success,
        message: data.message || "Lỗi khi gửi lời mời kết bạn",
      };
    }

    return {
      success: data.success,
      message: data.message || "Gửi lời mời kết bạn thành công",
    };
  } catch (error) {
    return {
      success: false,
      message: "Lỗi server",
      error: error,
    };
  }
};
