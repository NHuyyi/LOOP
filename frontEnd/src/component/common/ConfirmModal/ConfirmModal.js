import React from "react";
import styles from "./ConfirmModal.module.css";
import classNames from "classnames/bind";

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

  return (
    <div className={cx("modalOverlay")} onClick={onClose}>
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
            {isProcessing ? <Loading size="small" /> : "Xóa"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
