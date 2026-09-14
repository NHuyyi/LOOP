import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function AdminPage() {
    const currentUser = useSelector((state) => state.user.user);

    // Nếu chưa đăng nhập hoặc không phải admin -> Đẩy về trang chủ / login
    if (!currentUser) return <Navigate to="/" />;
    if (currentUser.role !== "admin") return <Navigate to="/home" />;

    return (
        <div style={{ padding: "30px", background: "#f9f9f9", minHeight: "100vh" }}>
            <h1>Bảng Điều Khiển Admin</h1>
            <p>Xin chào Admin: <strong>{currentUser.name}</strong></p>

            <div style={{ marginTop: "20px" }}>
                <h3>Các chức năng sẽ phát triển:</h3>
                <ul>
                    <li>Nhận và quản lý các báo cáo của user</li>
                    <li>Khóa / Xóa tài khoản user</li>
                    <li>Gửi tin nhắn trực tiếp đến user không cần kết bạn</li>
                    <li>Xóa tin nhắn giữa admin và user</li>
                </ul>
            </div>
        </div>
    );
}

export default AdminPage;