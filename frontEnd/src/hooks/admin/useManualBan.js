import { useState } from "react";
import { useToast } from "../../context/ToastContext";
import { manualBanUser } from "../../services/admin/manualBanUser";

export const useManualBan = (onSuccessRefresh) => {
    const toast = useToast();

    // Thêm cờ isFromReport để UI biết hiển thị giao diện nào
    const [modalState, setModalState] = useState({ isOpen: false, user: null, reportId: null, isFromReport: false });
    const [penaltyLevel, setPenaltyLevel] = useState(1);

    // Lý do khóa tự do (Trường hợp 2)
    const [customReason, setCustomReason] = useState("Vi phạm tiêu chuẩn cộng đồng");
    // Lý do trích xuất từ Report (Trường hợp 1)
    const [reportReason, setReportReason] = useState("");

    const [isBanning, setIsBanning] = useState(false);

    // TRƯỜNG HỢP 1: MỞ MODAL TỪ ĐƠN TỐ CÁO
    const openBanModalForReport = (report) => {
        setModalState({
            isOpen: true,
            user: report.reportedUser,
            reportId: report._id,
            isFromReport: true
        });
        setReportReason(report.reasonLabel);
        setPenaltyLevel(1);
    };

    // TRƯỜNG HỢP 2: MỞ MODAL KHÓA TRỰC TIẾP (TỰ DO)
    const openBanModalForUser = (user) => {
        setModalState({
            isOpen: true,
            user: user,
            reportId: null,
            isFromReport: false
        });
        setCustomReason("Vi phạm tiêu chuẩn cộng đồng");
        setPenaltyLevel(1);
    };

    const closeBanModal = () => {
        setModalState({ isOpen: false, user: null, reportId: null, isFromReport: false });
    };

    const handleBan = async () => {
        if (!modalState.user) return;
        setIsBanning(true);

        try {
            const targetUserId = modalState.user.id;

            // Nếu khóa qua report thì lấy lý do gốc của report. Nếu khóa tự do thì lấy lý do Admin vừa chọn
            const reasonLabels = modalState.isFromReport
                ? [reportReason]
                : (Array.isArray(customReason) ? customReason : [customReason]);

            const data = await manualBanUser(targetUserId, penaltyLevel, reasonLabels, modalState.reportId);

            if (data && data.success) {
                toast.success(data.message);
                closeBanModal();
                if (onSuccessRefresh) onSuccessRefresh();
            } else {
                toast.error(data?.message || "Có lỗi xảy ra khi khóa!");
            }
        } catch (error) {
            console.error("Lỗi khóa user tại Hook:", error);
            toast.error("Lỗi không xác định!");
        } finally {
            setIsBanning(false);
        }
    };

    return {
        modalState,
        penaltyLevel, setPenaltyLevel,
        customReason, setCustomReason, // Trả về để gắn vào thẻ <select>
        isBanning,
        openBanModalForReport,
        openBanModalForUser,
        closeBanModal,
        handleBan
    };
};