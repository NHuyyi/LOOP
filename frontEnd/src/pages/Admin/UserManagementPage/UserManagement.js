import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./UserManagement.module.css";
import { getAllUsers } from "../../../services/admin/getAllUsers";
import Loading from "../../../component/Loading/Loading";
import UserTable from "../../../component/Admin/UserManagement/UserTable/UserTable";
import { useToast } from "../../../context/ToastContext";
import UserFilter from "../../../component/Admin/UserManagement/UserFilter/UserFilter";

const cx = classNames.bind(styles);

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    useEffect(() => {
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

            <div className={cx("card")}>
                <UserFilter
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filterStatus={filterStatus}
                    setFilterStatus={setFilterStatus}
                />
                <h3 className={cx("card-title")}>Danh sách Người dùng</h3>
                <UserTable users={filteredUsers} />
            </div>
        </div>
    );
}

export default UserManagement;