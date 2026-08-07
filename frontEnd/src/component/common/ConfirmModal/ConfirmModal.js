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
}) => {

  if (!isOpen) return null;


  return createPortal(
    <div className={cx("modalOverlay")} data-confirm-modal onClick={onClose}>
      {/* Dừng sự kiện click để không bị đóng khi click vào trong box */}
      <div className={cx("modalContent")} onClick={(e) => e.stopPropagation()}>
        <h3 className={cx("title")}>{title}</h3>
        <p className={cx("message")}>{message}</p>

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
            disabled={isProcessing}
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
