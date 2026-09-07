import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

// Hàm hỗ trợ giải mã JWT và kiểm tra hạn sử dụng
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    // Lấy phần Payload của JWT (nằm giữa 2 dấu chấm)
    const payload = JSON.parse(atob(token.split('.')[1]));
    // payload.exp tính bằng giây, Date.now() tính bằng mili-giây
    return Date.now() >= payload.exp * 1000;
  } catch (error) {
    return true; // Nếu chuỗi token lỗi/không đúng định dạng thì coi như hết hạn
  }
};

export default function AuthRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const publicPaths = ["/", "/otp", "/forget-password", "/reset-password"];
    const isPublicPath = publicPaths.includes(location.pathname);

    // Kiểm tra token thực sự còn hạn hay không
    const expired = isTokenExpired(token);

    if (expired && token) {
      // Dọn dẹp dữ liệu cũ ngay khi phát hiện token hết hạn
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
    }

    const isValidSession = token && !expired;

    if (isValidSession && isPublicPath) {
      navigate("/home");
    } else if (!isValidSession && !isPublicPath) {
      navigate("/");
    }
  }, [token, location.pathname, navigate]);

  return null;
}