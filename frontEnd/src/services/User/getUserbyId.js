const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

exports.getUserbyId = async (id) => {
  try {
    const res = await fetch(`${API_URL}/users/getUserById`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (!res.ok) {
      return {
        success: data.success,
        status: res.status,
        message:
          data.message || "Lây thông tin người dùng thất bại, vui lòng thử lại",
      };
    }

    return data.user;
  } catch (error) {
    return {
      success: false,
      message: "lỗi server",
      error: error,
    };
  }
};
