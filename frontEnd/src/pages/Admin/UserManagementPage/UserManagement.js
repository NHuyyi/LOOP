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
import { useManualBan } from "../../../hooks/admin/useManualBan";
import { manualBanUser } from "../../../services/admin/manualBanUser";
const cx = classNames.bind(styles);

const REASON_OPTIONS = [
    { id: "spam", label: "Spam / Tin rác", color: "#f59f00" }, // Cam
    { id: "harassment", label: "Quấy rối / Bắt nạt", color: "#e03131" }, // Đỏ
    { id: "hate_speech", label: "Ngôn từ thù ghét", color: "#8c1af6" }, // Tím
    { id: "inappropriate_content", label: "Nội dung phản cảm", color: "#c92a2a" }, // Đỏ đậm
    { id: "other", label: "Lý do khác", color: "#868e96" }, // Xám
];

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

    const {
        modalState: banModalState, penaltyLevel, setPenaltyLevel,
        customReason, setCustomReason, isBanning,
        openBanModalForUser, closeBanModal, handleBan
    } = useManualBan(fetchUsers);

    const toggleReason = (reasonId) => {
        const currentReasons = Array.isArray(customReason) ? customReason : [];
        if (currentReasons.includes(reasonId)) {
            setCustomReason(currentReasons.filter(id => id !== reasonId));
        } else {
            setCustomReason([...currentReasons, reasonId]);
        }
    };

    // Hàm gọi khi nhấn nút Khóa trên bảng (Reset lại lý do mặc định về mảng rỗng)
    const handleOpenBanModal = (user) => {
        setCustomReason([]);
        setPenaltyLevel(1);
        openBanModalForUser(user);
    };


    const [unlockModal, setUnlockModal] = useState({ isOpen: false, user: null });
    const [isUnlocking, setIsUnlocking] = useState(false);

    const handleOpenUnlockModal = (user) => {
        setUnlockModal({ isOpen: true, user });
    };

    const handleConfirmUnlock = async () => {
        if (!unlockModal.user) return;
        setIsUnlocking(true);
        try {
            // Gửi penaltyLevel = 0 và mảng lý do rỗng để gỡ phạt hoàn toàn
            const res = await manualBanUser(unlockModal.user.id, 0, []);
            if (res.success) {
                toast.success("Mở khóa tài khoản thành công!");
                fetchUsers(); // Tải lại danh sách
            } else {
                toast.error(res?.message || "Lỗi khi mở khóa!");
            }
        } catch (error) {
            toast.error("Lỗi máy chủ.");
        } finally {
            setIsUnlocking(false);
            setUnlockModal({ isOpen: false, user: null });
        }
    };

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
                <UserTable users={filteredUsers} openDeleteModal={openDeleteModal} openBanModal={handleOpenBanModal} openUnlockModal={handleOpenUnlockModal} />
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

            <ConfirmModal
                isOpen={banModalState.isOpen}
                onClose={closeBanModal}
                onConfirm={handleBan}
                title="Khóa tài khoản người dùng"
                isProcessing={isBanning}
                disableConfirm={
                    penaltyLevel !== 0 && (!Array.isArray(customReason) || customReason.length === 0)
                }
            >
                <div style={{ margin: "16px 0", fontSize: "0.95rem", color: "#333", textAlign: "left" }}>
                    <p style={{ marginBottom: "20px" }}>
                        Tiến hành khóa người dùng: <strong style={{ color: "#e03131" }}>{banModalState.user?.name}</strong>
                    </p>

                    {/* Vùng chọn lý do (Các nút chip) */}
                    <div style={{ marginBottom: "24px" }}>
                        <label style={{ fontWeight: 600, display: "block", marginBottom: "12px" }}>Chọn lý do vi phạm:</label>
                        <div className={cx("reason-buttons-container")}>
                            {REASON_OPTIONS.map(opt => {
                                const isSelected = Array.isArray(customReason) && customReason.includes(opt.id);
                                return (
                                    <button
                                        key={opt.id}
                                        type="button"
                                        className={cx("reason-btn", { active: isSelected })}
                                        style={{ "--btn-color": opt.color }}
                                        onClick={() => toggleReason(opt.id)}
                                    >
                                        {opt.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Vùng chọn thời gian khóa */}
                    <div>
                        <label style={{ fontWeight: 600, display: "block", marginBottom: "8px" }}>Chọn cấp độ khóa:</label>
                        <select
                            value={penaltyLevel}
                            onChange={(e) => setPenaltyLevel(Number(e.target.value))}
                            disabled={isBanning}
                            className={cx("penalty-select")}
                        >
                            <option value={1}>Level 1: Khóa 1 ngày</option>
                            <option value={2}>Level 2: Khóa 1 tuần</option>
                            <option value={3}>Level 3: Khóa 1 tháng</option>
                            <option value={4}>Level 4: Khóa 1 năm</option>
                            <option value={5}>Level 5: Cấm vĩnh viễn</option>
                            <option value={0}>Gỡ hình phạt (Mở khóa)</option>
                        </select>
                    </div>
                </div>
            </ConfirmModal>

            <ConfirmModal
                isOpen={unlockModal.isOpen}
                onClose={() => setUnlockModal({ isOpen: false, user: null })}
                onConfirm={handleConfirmUnlock}
                title="Xác nhận mở khóa"
                isProcessing={isUnlocking}
            >
                <div style={{ margin: "16px 0", fontSize: "0.95rem", color: "#333", textAlign: "left", lineHeight: "1.5" }}>
                    Bạn có chắc chắn muốn gỡ bỏ mọi hình phạt và mở khóa cho tài khoản <strong>{unlockModal.user?.name}</strong> không?
                </div>
            </ConfirmModal>
        </div>
    );
}

export default UserManagement;