import React, { useState} from "react";
import classNames from "classnames/bind";
import styles from "./ReportDetailModal.module.css";
import Loading from "../../../Loading/Loading";
import { X } from "lucide-react";
import ConfirmModal from "../../../common/ConfirmModal/ConfirmModal";

const cx = classNames.bind(styles);

const REASON_TRANSLATIONS = {
    spam: "Spam / Tin rác",
    harassment: "Quấy rối / Bắt nạt",
    hate_speech: "Ngôn từ thù ghét",
    inappropriate_content: "Nội dung phản cảm",
    other: "Lý do khác"
};

function ReportDetailModal({ isOpen, onClose, report, onBanClick, onRejectConfirm, isProcessing }) {

    const [showConfirmReject, setShowConfirmReject] = useState(false);

    // Reset lại state mỗi khi mở/đóng modal
    const handleCloseModal = () => {
        setShowConfirmReject(false);
    };

    if (!isOpen || !report) return null;

    const handleBan = () => {
        onBanClick(report);
    };

    return (
        <div className={cx("overlay")} onClick={onClose}>
            <div className={cx("modal")} onClick={(e) => e.stopPropagation()}>

                {/* HEADER - Thiết kế giống bảng ConfirmModal cũ */}
                <div className={cx("modal-header")}>
                    <h3 className={cx("modal-title")}>Chi tiết báo cáo vi phạm</h3>
                    <button className={cx("close-btn")} onClick={onClose} disabled={isProcessing}>
                        <X size={20} />
                    </button>
                </div>

                {/* BODY - Đã dồn toàn bộ sang trái */}
                <div className={cx("modal-body")}>
                    <div className={cx("info-row")}>
                        <span className={cx("label")}>Người báo cáo:</span>
                        <div className={cx("user-chip")}>
                            <img src={report.reporter?.avatar || "/default-avatar.png"} alt="avatar" />
                            <span>{report.reporter?.name}</span>
                        </div>
                    </div>

                    <div className={cx("info-row")}>
                        <span className={cx("label")}>Bị báo cáo:</span>
                        <div className={cx("user-chip")}>
                            <img src={report.reportedUser?.avatar || "/default-avatar.png"} alt="avatar" />
                            <span className={cx("text-danger")}>{report.reportedUser?.name}</span>
                        </div>
                    </div>

                    <div className={cx("info-group")}>
                        <span className={cx("label")}>Lý do:</span>
                        <span className={cx("reason-badge")}>
                            {REASON_TRANSLATIONS[report.reasonLabel] || report.reasonLabel}
                        </span>
                    </div>

                    <div className={cx("info-group")}>
                        <span className={cx("label")}>Mô tả chi tiết:</span>
                        <div className={cx("description-box")}>
                            {report.description ? report.description : <span className={cx("empty-text")}>Không có mô tả chi tiết.</span>}
                        </div>
                    </div>

                    {report.evidenceImage && (
                        <div className={cx("info-group")}>
                            <span className={cx("label")}>Bằng chứng:</span>
                            <div className={cx("evidence-image")}>
                                <img src={report.evidenceImage} alt="Bằng chứng" />
                            </div>
                        </div>
                    )}

                </div>

                {/* FOOTER */}
                <div className={cx("modal-footer")}>
                    <button
                        className={cx("btn-reject")}
                        onClick={() => setShowConfirmReject(true)}
                        disabled={isProcessing}
                    >
                        Bỏ qua cáo buộc
                    </button>
                    <button
                        className={cx("btn-ban")}
                        onClick={handleBan}
                        disabled={isProcessing}
                    >
                        {isProcessing ? <Loading size="small" /> : "Tiến hành Khóa"}
                    </button>
                </div>
                <ConfirmModal
                    isOpen={showConfirmReject}
                    // Nút "Hủy": Chỉ tắt modal Confirm, ReportDetailModal vẫn ở bên dưới
                    onClose={handleCloseModal}
                    // Nút "Xác nhận": Chạy hàm từ chối và tự động đóng Confirm
                    onConfirm={() => {
                        onRejectConfirm(report._id);
                        handleCloseModal();
                    }}
                    title="Xác nhận bác bỏ"
                    isProcessing={isProcessing}
                >
                    <div style={{ margin: "16px 0", fontSize: "0.95rem", textAlign: "left" }}>
                        <p>Bạn có chắc chắn muốn bác bỏ đơn tố cáo của <strong>{report.reporter?.name}</strong> đối với <strong>{report.reportedUser?.name}</strong> không?</p>
                        <p style={{ marginTop: "8px", color: "#6c757d", lineHeight: "1.5" }}>
                            Hành động này sẽ đánh dấu báo cáo là đã xử lý, không áp dụng hình phạt và sẽ thông báo kết quả cho người tố cáo.
                        </p>
                    </div>
                </ConfirmModal>
            </div>
        </div>

    );
}

export default ReportDetailModal;