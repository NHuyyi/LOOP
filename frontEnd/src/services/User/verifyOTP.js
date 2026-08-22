import FingerprintJS from "@fingerprintjs/fingerprintjs";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

async function getDeviceId() {
  const CACHE_KEY = "deviceId";

  // Ưu tiên lấy từ cache trước
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) return cached;

  // Chưa có cache → generate bằng FingerprintJS
  const fp = await FingerprintJS.load();
  const result = await fp.get();
  const deviceId = result.visitorId; // hash hex ~32 ký tự, ổn định theo browser

  localStorage.setItem(CACHE_KEY, deviceId);
  return deviceId;
}

export const verifyOTP = async (email, password, otp) => {
  try {

    const deviceId = await getDeviceId();

    const res = await fetch(`${API_URL}/users/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, otp, deviceId }),
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
      error: error,
    };
  }
};
