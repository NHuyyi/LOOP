const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

exports.resetpassword = async (email, password, comfimPassword) => {
  try {
    const res = await fetch(`${API_URL}/users/reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, comfimPassword }),
    });
    const data = await res.json();
    if (!res.ok) {
      return {
        success: data.success,
        status: res.status,
        message: data.message || "đổi thất bại",
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
