const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

exports.forgetpassword = async (email) => {
  try {
    const res = await fetch(`${API_URL}/users/forget`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) {
      return {
        success: data.success,
        status: res.status,
        message: data.message || "Không tìm thấy tài khoản của bạn",
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
