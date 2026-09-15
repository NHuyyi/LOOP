import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Routes, Route } from "react-router-dom";
import AdminHeader from "../component/Header/AdminHeader/AdminHeader";
import UserManagement from "../pages/Admin/UserManagementPage/UserManagement";

function AdminPage() {
    const currentUser = useSelector((state) => state.user.user);

    if (!currentUser) return <Navigate to="/" />;
    if (currentUser.role !== "admin") return <Navigate to="/home" />;

    return (
        <div style={{ background: "#f9f9f9", minHeight: "100vh" }}>
            <AdminHeader />

            <div style={{ padding: "30px", maxWidth: "1200px", margin: "0 auto" }}>
                <Routes>
                    {/* Route mặc định của Admin */}
                    <Route path="/" element={
                        <div>
                            <h1>Bảng Điều Khiển Admin</h1>
                            <p>Chọn chức năng trên thanh điều hướng để quản lý hệ thống.</p>
                        </div>
                    } />

                    {/* Các component này bạn sẽ tạo tương ứng với quyền hạn */}
                    <Route path="/reports" element={<div>Giao diện Nhận báo cáo User</div>} />
                    <Route path="/accounts" element={<UserManagement />} />
                    <Route path="/chat" element={<div>Giao diện Nhắn tin & Xóa tin nhắn hệ thống</div>} />
                </Routes>
            </div>
        </div>
    );
}

export default AdminPage;