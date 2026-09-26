import React, { useState, useRef, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./ReportUserModal.module.css";
import ConfirmModal from "../../common/ConfirmModal/ConfirmModal";
import { ChevronDown, ImagePlus } from "lucide-react"; // Lấy icon mũi tên từ thư viện bạn đang dùng

const cx = classNames.bind(styles);

function ReportUserModal({
    isOpen, onClose, onConfirm, isSubmitting, targetUser,
    reasonLabel, setReasonLabel, description, setDescription, imagePreview, handleImageChange
}) {
    // State quản lý việc mở/đóng menu thả xuống
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Danh sách các lựa chọn
    const options = [
        { value: "spam", label: "Spam / Tin rác" },
        { value: "harassment", label: "Quấy rối / Bắt nạt" },
        { value: "hate_speech", label: "Ngôn từ thù ghét" },
        { value: "inappropriate_content", label: "Nội dung phản cảm" },
        { value: "other", label: "Lý do khác" },
    ];

    // Lấy nhãn hiển thị của lựa chọn hiện tại
    const selectedOption = options.find(opt => opt.value === reasonLabel) || options[0];

    // Xử lý click ra ngoài để đóng menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        if (isDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isDropdownOpen]);

    const handleSelectOption = (value) => {
        setReasonLabel(value);
        setIsDropdownOpen(false);
    };

    return (
        <ConfirmModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            title="Báo cáo vi phạm"
            isProcessing={isSubmitting}
        >
            <div className={cx("modal-body")}>
                <p className={cx("description-text")}>
                    Bạn đang báo cáo người dùng <strong className={cx("highlight-name")}>{targetUser?.name}</strong>. Vui lòng chọn lý do chính xác.
                </p>

                <div className={cx("form-group")}>
                    <label className={cx("form-label")}>Loại vi phạm:</label>

                    {/* CUSTOM DROPDOWN BẮT ĐẦU TỪ ĐÂY */}
                    <div className={cx("custom-select-wrapper")} ref={dropdownRef}>
                        <div
                            className={cx("form-control", "custom-select-trigger", { disabled: isSubmitting })}
                            onClick={() => !isSubmitting && setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <span>{selectedOption.label}</span>
                            <ChevronDown
                                size={18}
                                className={cx("arrow-icon", { open: isDropdownOpen })}
                            />
                        </div>

                        {/* Danh sách xổ xuống (Render bằng div thay vì option) */}
                        {isDropdownOpen && !isSubmitting && (
                            <div className={cx("custom-options-list")}>
                                {options.map((option) => (
                                    <div
                                        key={option.value}
                                        className={cx("custom-option", { selected: reasonLabel === option.value })}
                                        onClick={() => handleSelectOption(option.value)}
                                    >
                                        {option.label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className={cx("form-group")}>
                    <label className={cx("form-label")}>Mô tả chi tiết (Tùy chọn):</label>
                    <textarea
                        className={cx("form-control")}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={isSubmitting}
                        placeholder="Cung cấp thêm thông tin về hành vi vi phạm..."
                        rows={3}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !isSubmitting) {
                                e.preventDefault();
                                onConfirm()
                            }
                        }}
                    />
                </div>
                <div className={cx("form-group")}>
                    <label className={cx("form-label")}>Ảnh minh họa (Bằng chứng):</label>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <label style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 12px", background: "#f1f3f5", borderRadius: "8px", cursor: "pointer", color: "#495057", fontSize: "14px", fontWeight: 500 }}>
                            <ImagePlus size={18} /> Chọn ảnh
                            <input type="file" accept="image/*" onChange={handleImageChange} hidden disabled={isSubmitting} />
                        </label>
                        {imagePreview && (
                            <img src={imagePreview} alt="preview" style={{ height: "40px", borderRadius: "4px", border: "1px solid #ddd" }} />
                        )}
                    </div>
                </div>
            </div>
        </ConfirmModal>
    );
}

export default ReportUserModal;