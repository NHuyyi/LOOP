import React, { useEffect, useRef } from "react";
import styles from "./MessageMenu.module.css";
import classNames from "classnames/bind";
import ReplyButton from "./ReplyButton/ReplyButton";
import ForwardButton from "./ForwardButton/ForwardButton";
import DeleteButton from "./DeleteButton/DeleteButton";
import RevokeButton from "./RevokeButton/RevokeButton";
import { X } from "lucide-react"; // Import icon nút X

const cx = classNames.bind(styles);

const MessageMenu = ({ message, isOwnMessage, onClose, activeReceiver }) => {
  const menuRef = useRef(null);

  // Xử lý sự kiện click ra ngoài menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Nếu click chuột xảy ra, và vị trí click KHÔNG nằm trong menuRef -> thì đóng menu
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Gắn sự kiện lắng nghe chuột (mousedown) lên toàn bộ trang web
    document.addEventListener("mousedown", handleClickOutside);
    // This code checks and scrolls the menu into view if menu's top exceeds the safe margin top
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      
      // This code checks the Message's position if menu's top or menu's bottom is outside the viewport, the menu will scroll
      if (rect.top < 60 || rect.bottom > viewportHeight) {
        menuRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" }); 
      }
    }

    // Dọn dẹp sự kiện khi Menu bị đóng/hủy (rất quan trọng để tránh lỗi bộ nhớ)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className={cx("message-menu-wrapper")} ref={menuRef}>
      <div className={cx("message-menu-dropdown")}>
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
