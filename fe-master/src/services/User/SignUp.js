const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

exports.SignUp = async (name, email, password, checkpassword) => {
  try {
    const res = await fetch(`${API_URL}/users/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, checkpassword }),
    });
    const data = await res.json();
    if (!res.ok) {
      return {
        success: data.success,
        status: res.status,
        message: data.message || "Đăng ký thất bại vui lòng kiểm tra thông tin",
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
