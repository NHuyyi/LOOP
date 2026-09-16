import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./UserManagement.module.css";
import { getAllUsers } from "../../../services/admin/getAllUsers";
import Loading from "../../../component/Loading/Loading";
import UserTable from "../../../component/Admin/UserManagement/UserTable/UserTable";
import { useToast } from "../../../context/ToastContext";
import UserFilter from "../../../component/Admin/UserManagement/UserFilter/UserFilter";
import UserCharts from "../../../component/Admin/UserManagement/UserCharts/UserCharts";
import ConfirmModal from "../../../component/common/ConfirmModal/ConfirmModal";
import { useDeleteUser } from "../../../hooks/admin/UseDeleteUser";
const cx = classNames.bind(styles);

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    const fetchUsers = async () => {
        setLoading(true);
        const res = await getAllUsers();
        if (res.success) {
            setUsers(res.data);
        } else {
            toast.error("Không thể tải danh sách người dùng!");
        }
        setLoading(false);
    };

    const {
        modalState,
        confirmEmail,
        setConfirmEmail,
        isDeleting,
        openDeleteModal,
        closeDeleteModal,
        handleDelete
    } = useDeleteUser(fetchUsers);

    useEffect(() => {
        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) {
        return <Loading fullScreen text="Đang tải dữ liệu..." />;
    }


    const filteredUsers = users.filter((user) => {
        // 1. Lọc theo chữ (Tên, Email, FriendCode)
        const matchSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.friendCode.toLowerCase().includes(searchTerm.toLowerCase());

        // 2. Lọc theo trạng thái
        let matchStatus = true;
        if (filterStatus === "active") {
            matchStatus = !user.isdelete && user.isVerified;
        } else if (filterStatus === "banned") {
            matchStatus = user.isdelete;
        } else if (filterStatus === "unverified") {
            matchStatus = !user.isdelete && !user.isVerified;
        }

        return matchSearch && matchStatus;
    });

    return (
        <div className={cx("management-container")}>
            {/* Tương lai: Thêm Thanh tìm kiếm và Biểu đồ ở đây */}
            <UserCharts users={users} />

            <div className={cx("card")}>
                <UserFilter
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filterStatus={filterStatus}
                    setFilterStatus={setFilterStatus}
                />
                <h3 className={cx("card-title")}>Danh sách Người dùng</h3>
                <UserTable users={filteredUsers} openDeleteModal={openDeleteModal} />
            </div>
            <ConfirmModal
                isOpen={modalState.isOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
                title="Cảnh báo: Xóa vĩnh viễn!"
                isProcessing={isDeleting}
                disableConfirm={confirmEmail.trim() !== modalState.user?.email}
            >
                {/* Đây chính là phần {children} sẽ được chèn vào khe giữa của Modal */}
                <div style={{ margin: "16px 0", fontSize: "0.95rem", color: "#333", textAlign: "left" }}>
                    <p style={{ marginBottom: "16px", lineHeight: "1.5" }}>
                        Bạn đang thao tác xóa người dùng <strong>{modalState.user?.name}</strong>.
                        Hành động này sẽ phá hủy hoàn toàn dữ liệu.
                    </p>
                    <label style={{ fontWeight: 600, display: "block", marginBottom: "8px" }}>
                        Nhập Email <span style={{ color: "#c92a2a" }}>{modalState.user?.email}</span> để xác nhận:
                    </label>
                    <input
                        type="text"
                        placeholder="Gõ lại email..."
                        value={confirmEmail}
                        onChange={(e) => setConfirmEmail(e.target.value)}
                        disabled={isDeleting}
                        style={{
                            width: "100%",
                            padding: "10px 12px",
                            borderRadius: "8px",
                            border: "1px solid #ced4da",
                            outline: "none",
                            fontSize: "14px"
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault(); // Ngăn hành vi mặc định của phím Enter
                                // Kiểm tra y hệt điều kiện khóa nút (phải đúng email và không đang chạy API)
                                if (confirmEmail.trim() === modalState.user?.email && !isDeleting) {
                                    handleDelete();
                                }
                            }
                        }}
                    />
                </div>
            </ConfirmModal>
        </div>
    );
}

export default UserManagement;