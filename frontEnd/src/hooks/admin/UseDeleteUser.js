import { useState, useEffect } from "react";
import { useToast } from "../../context/ToastContext";
// Import service bạn vừa tạo (Nhớ trỏ đúng đường dẫn thư mục)
import { hardDeleteUser } from "../../services/admin/deleteUser";

export const useDeleteUser = (onSuccessRefresh) => {
    const toast = useToast();
    const [modalState, setModalState] = useState({ isOpen: false, user: null });
    const [confirmEmail, setConfirmEmail] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const openDeleteModal = (user) => {
        setModalState({ isOpen: true, user });
        setConfirmEmail("")
    };

    const closeDeleteModal = () => {
        setModalState({ isOpen: false, user: null });
        setConfirmEmail("");
    };

    const handleDelete = async () => {
        if (!modalState.user) return;

        if (confirmEmail.trim() !== modalState.user.email) {
            toast.error("Email xác nhận không khớp!");
            return;
        }

        setIsDeleting(true);
        try {
            // Gọi hàm từ Service thay vì viết fetch trực tiếp
            const data = await hardDeleteUser(modalState.user.id, confirmEmail.trim());
            console.log("data", data)
            if (data?.success) {
                toast.success(data.message);
                closeDeleteModal();
                if (onSuccessRefresh) onSuccessRefresh(); // Refresh lại danh sách bảng
            } else {
                toast.error(data?.message || "Có lỗi xảy ra khi xóa!");
                closeDeleteModal(); // Vẫn đóng modal kể cả khi gặp thông báo "Đang phát triển"
            }
        } catch (error) {
            console.error("Lỗi xóa user tại Hook:", error);
            toast.error("Lỗi không xác định!");
        } finally {
            setIsDeleting(false);
        }
    };


    return {
        modalState,
        confirmEmail,
        setConfirmEmail,
        isDeleting,
        openDeleteModal,
        closeDeleteModal,
        handleDelete
    };


};