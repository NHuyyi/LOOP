import React, { useEffect, useRef } from "react";
import styles from "./MessageMenu.module.css";
import classNames from "classnames/bind";
import ReplyButton from "./ReplyButton/ReplyButton";
import ForwardButton from "./ForwardButton/ForwardButton";
import DeleteButton from "./DeleteButton/DeleteButton";
import RevokeButton from "./RevokeButton/RevokeButton";
import { X } from "lucide-react"; // Import icon nút X

const cx = classNames.bind(styles);

const MessageMenu = ({ message, isOwnMessage, onClose, activeReceiver, isMiniChat }) => {
  const menuRef = useRef(null);

  // Xử lý sự kiện click ra ngoài menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();

      // Hàm tìm thẻ cha gần nhất có thanh cuộn
      let scrollContainer = menuRef.current.parentElement;
      while (scrollContainer) {
        const style = window.getComputedStyle(scrollContainer);
        if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
          break;
        }
        scrollContainer = scrollContainer.parentElement;
      }

      // Nếu tìm thấy khung chứa, tính toán dựa trên khung chứa đó
      if (scrollContainer) {
        const containerRect = scrollContainer.getBoundingClientRect();
        if (rect.top < containerRect.top || rect.bottom > containerRect.bottom) {
          menuRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      } else {
        // Fallback cho an toàn nếu không tìm thấy
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        if (rect.top < 60 || rect.bottom > viewportHeight) {
          menuRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className={cx("message-menu-wrapper")} ref={menuRef}>
      <div className={cx("message-menu-dropdown", { "mini-chat-menu": isMiniChat })}>
        {/* Phần Header chứa tiêu đề và nút X */}
        <div className={cx("menu-header")}>
          <span className={cx("menu-title")}>Tùy chọn</span>
          <button className={cx("close-btn")} onClick={onClose} title="Đóng">
            <X size={16} />
          </button>
        </div>

        {/* Các chức năng chính */}
        <div className={cx("menu-actions")}>
          <ReplyButton message={message} closeMenu={onClose} />
          <ForwardButton
            message={message}
            closeMenu={onClose}
            activeReceiver={activeReceiver}
          />
          <DeleteButton message={message} closeMenu={onClose} />
          {isOwnMessage && (
            <RevokeButton message={message} closeMenu={onClose} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageMenu;
