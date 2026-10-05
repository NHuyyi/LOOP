import React from "react";
import styles from "./ConfirmModal.module.css";
import classNames from "classnames/bind";
import { createPortal } from "react-dom";

import Loading from "../../Loading/Loading";

const cx = classNames.bind(styles);

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isProcessing,
  disableConfirm, // Bổ sung cờ khóa nút
  children        // Bổ sung khe cắm form HTML
}) => {

  if (!isOpen) return null;

  return createPortal(
    <div className={cx("modalOverlay")} data-confirm-modal onClick={onClose}>
      <div className={cx("modalContent")} onClick={(e) => e.stopPropagation()}>
        <h3 className={cx("title")}>{title}</h3>

        {/* Vẫn giữ nguyên hiển thị message cũ (nếu có) */}
        {message && <p className={cx("message")}>{message}</p>}

        {/* Hiển thị form nhập Email */}
        {children}

        <div className={cx("actions")}>
          <button
            className={cx("btn", "cancelBtn")}
            onClick={onClose}
            disabled={isProcessing}
          >
            Hủy
          </button>
          <button
            className={cx("btn", "confirmBtn")}
            onClick={onConfirm}
            // Khóa nút nếu đang tải HOẶC khi email chưa khớp
            disabled={isProcessing || disableConfirm}
          >
            {isProcessing ? <Loading size="small" /> : "Xác nhận"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ConfirmModal;