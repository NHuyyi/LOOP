import FingerprintJS from "@fingerprintjs/fingerprintjs";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

/**
 * Lấy deviceId bền vững dựa trên browser fingerprint.
 *
 * - Cùng browser/máy: luôn trả về cùng 1 visitorId → 2 tài khoản khác nhau
 *   trên cùng máy sẽ có cùng deviceId ✔
 * - Khác browser / khác máy: visitorId khác dù cùng cấu hình / cùng mạng ✔
 * - Cache vào localStorage để tránh gọi FingerprintJS mỗi lần login
 */
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

export const Login = async (email, password) => {
  try {
    // Lấy deviceId từ fingerprint (stable, không random)
    const deviceId = await getDeviceId();

    const res = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, deviceId }),
    });
    const data = await res.json();
    if (!res.ok) {
      return {
        success: data.success,
        status: res.status,
        message:
          data.message || "Đăng nhập thất bại vui lòng kiểm tra thông tin",
        user: data.user || null,
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
