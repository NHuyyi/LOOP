const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

exports.resendOTP = async (email) => {
  try {
    const res = await fetch(`${API_URL}/users/resend-otp`, {
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
        message: data.message || "OTP không hợp lệ",
      };
    }
    return data;
  } catch (error) {
    return {
      success: false,
      message: "lỗi server",
    };
  }
};
