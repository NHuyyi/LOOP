import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function AuthRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useSelector((state) => state.user.user);

  useEffect(() => {
    // 1. Lấy token trực tiếp từ localStorage để check (tránh độ trễ của Redux)
    const token = localStorage.getItem("token");

    // 2. Danh sách các đường dẫn Public (không cần đăng nhập)
    const publicRoutes = ["/", "/otp", "/forget-password", "/reset-password"];
    const isPublicRoute = publicRoutes.includes(location.pathname);

    // KỊCH BẢN 1: KHÔNG CÓ TOKEN NHƯNG CỐ VÀO TRANG BÊN TRONG (/home, /chat,...)
    if (!token && !isPublicRoute) {
      navigate("/"); // Lập tức đuổi về trang đăng nhập
      return;
    }

    // KỊCH BẢN 2: ĐÃ CÓ TOKEN NHƯNG LẠI VÀO TRANG ĐĂNG NHẬP (/)
    if (token && isPublicRoute && currentUser) {
      // Dựa vào Role để đẩy về đúng màn hình
      if (currentUser.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    }

    // KỊCH BẢN 3: ADMIN CỐ VÀO TRANG USER HOẶC NGƯỢC LẠI
    if (token && currentUser) {
      const isAdminRoute = location.pathname.startsWith("/admin");

      if (currentUser.role === "admin" && !isAdminRoute) {
        navigate("/admin"); // Admin thì chỉ được ở /admin
      } else if (currentUser.role !== "admin" && isAdminRoute) {
        navigate("/home"); // User thường cố vào /admin thì đẩy về /home
      }
    }

  }, [location.pathname, navigate, currentUser]);

  return null; // Component này chạy ngầm, không render ra UI
}

export default AuthRedirect;