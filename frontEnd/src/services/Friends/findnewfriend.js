const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

exports.findnewfriend = async (friendCode, userId) => {
  try {
    const res = await fetch(`${API_URL}/friends/findnewfriend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ friendCode, userId }),
    });
    const data = await res.json();
    if (!res.ok) {
      return {
        success: data.success,
        status: res.status,
        message: data.message || "Không tìm thấy người dùng",
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
