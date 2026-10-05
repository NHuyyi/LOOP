import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./ReportDashboard.module.css";

// Components
import ReportStatCards from "../../../component/Admin/Report/ReportStatCards/ReportStatCards";
import ReportPieChart from "../../../component/Admin/Report/ReportPieChar/ReportPieChar";
import ReportTable from "../../../component/Admin/Report/ReportTable/ReportTable";
import ConfirmModal from "../../../component/common/ConfirmModal/ConfirmModal";
import Loading from "../../../component/Loading/Loading";
import ReportCustomSelect from "../../../component/Admin/Report/ReportCustomSelect/ReportCustomSelect";

// Hooks
import { useFetchReports } from "../../../hooks/admin/useFetchReports";
import { useManualBan } from "../../../hooks/admin/useManualBan";

import ReportDetailModal from "../../../component/Admin/Report/ReportDetailModal/ReportDetailModal";
import { rejectReportAPI } from "../../../services/admin/rejectReport"
import { useToast } from "../../../context/ToastContext";

const cx = classNames.bind(styles);

function ReportDashboard() {
    const {
        reports, loading, page, totalPages, statusFilter,
        handlePageChange, handleFilterChange, refreshReports, dashboardStats
    } = useFetchReports();

    const toast = useToast();
    const [detailModal, setDetailModal] = useState({ isOpen: false, report: null });
    const [isRejecting, setIsRejecting] = useState(false);

    const { modalState: banModalState, penaltyLevel, setPenaltyLevel, isBanning, openBanModalForReport, closeBanModal, handleBan } = useManualBan(refreshReports);

    const [customReason, setCustomReason] = useState("");

    if (loading) return <Loading fullScreen text="Đang tải dữ liệu kiểm duyệt..." />;

    const statusOptions = [
        { value: "", label: "Tất cả trạng thái" },
        { value: "pending", label: "Đang chờ xử lý" },
        { value: "processed", label: "Đã giải quyết" }
    ];


    // Ghi đè hàm openBanModal của ReportRow
    const openDetailModal = (report) => setDetailModal({ isOpen: true, report });
    const closeDetailModal = () => setDetailModal({ isOpen: false, report: null });

    const handleProceedToBan = (report) => {
        closeDetailModal();
        openBanModalForReport(report);
    };

    const handleRejectConfirm = async (reportId) => {
        setIsRejecting(true);
        const res = await rejectReportAPI(reportId);
        setIsRejecting(false);
        if (res.success) {
            toast.success("Bác bỏ đơn thành công");
            closeDetailModal();
            refreshReports();
        } else {
            toast.error(res.message);
        }
    };

    return (
        <div className={cx("dashboard-container")}>

            {/* TẦNG TRÊN: Chia 2 cột (Thống kê 2x2 & Biểu đồ) */}
            <div className={cx("top-panel")}>
                <div className={cx("stats-wrapper")}>
                    <ReportStatCards stats={dashboardStats} />
                </div>
                <div className={cx("chart-wrapper")}>
                    <ReportPieChart data={dashboardStats?.byLabels} />
                </div>
            </div>

            {/* TẦNG DƯỚI: Bảng danh sách Full width */}
            <div className={cx("bottom-panel")}>
                <div className={cx("section-header")}>
                    <h3>Danh sách tố cáo</h3>
                    <div style={{ width: "200px" }}>
                        <ReportCustomSelect
                            options={statusOptions}
                            value={statusFilter}
                            onChange={handleFilterChange}
                        />
                    </div>
                </div>

                <ReportTable
                    reports={reports}
                    openBanModal={openDetailModal}
                    page={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
            <ReportDetailModal
                isOpen={detailModal.isOpen} onClose={closeDetailModal} report={detailModal.report}
                onBanClick={handleProceedToBan} onRejectConfirm={handleRejectConfirm} isProcessing={isRejecting}
            />

            {/* Modal Xử lý */}
            <ConfirmModal isOpen={banModalState.isOpen} onClose={closeBanModal} onConfirm={handleBan} title="Thiết lập mức phạt" isProcessing={isBanning}>
                <div style={{ margin: "16px 0", fontSize: "0.95rem", textAlign: "left" }}>
                    <p style={{ marginBottom: "16px" }}>
                        Thiết lập hình phạt cho người dùng <strong>{banModalState.user?.name}</strong>:
                    </p>

                    {/* NẾU KHÓA TỰ DO: HIỆN Ô CHO ADMIN CHỌN LÝ DO */}
                    {!banModalState.isFromReport && (
                        <div style={{ marginBottom: "16px" }}>
                            <label style={{ fontWeight: 600, display: "block", marginBottom: "8px" }}>Lý do khóa:</label>
                            <select
                                value={customReason}
                                onChange={(e) => setCustomReason(e.target.value)}
                                disabled={isBanning}
                                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ced4da", outline: "none", fontSize: "14px" }}
                            >
                                <option value="Vi phạm tiêu chuẩn cộng đồng">Vi phạm tiêu chuẩn cộng đồng</option>
                                <option value="spam">Spam / Tin rác</option>
                                <option value="harassment">Quấy rối / Bắt nạt</option>
                                <option value="hate_speech">Ngôn từ thù ghét</option>
                                <option value="inappropriate_content">Nội dung phản cảm</option>
                            </select>
                        </div>
                    )}

                    <label style={{ fontWeight: 600, display: "block", marginBottom: "8px" }}>
                        Chọn mức độ phạt:
                    </label>
                    <select
                        value={penaltyLevel}
                        onChange={(e) => setPenaltyLevel(Number(e.target.value))}
                        disabled={isBanning}
                        style={{
                            width: "100%", padding: "10px", borderRadius: "8px",
                            border: "1px solid #ced4da", outline: "none", fontSize: "14px"
                        }}
                    >
                        <option value={1}>Level 1: Khóa 1 ngày</option>
                        <option value={2}>Level 2: Khóa 1 tuần</option>
                        <option value={3}>Level 3: Khóa 1 tháng</option>
                        <option value={4}>Level 4: Khóa 1 năm</option>
                        <option value={5}>Level 5: Chờ xóa vĩnh viễn</option>
                        <option value={0}>Gỡ hình phạt (Mở khóa)</option>
                    </select>
                </div>
            </ConfirmModal>
        </div>
    );
}

export default ReportDashboard;