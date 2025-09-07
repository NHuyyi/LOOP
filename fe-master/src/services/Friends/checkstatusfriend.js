const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

exports.checkstatusfriend = async (userId, targetId) => {
  try {
    const res = await fetch(`${API_URL}/friends/checkFriendStatus`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ userId, targetId }),
    });
    const data = await res.json();
    if (!res.ok) {
      // trả về lỗi rõ ràng, không fake "status"
      throw new Error(data.message || "Request failed");
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
