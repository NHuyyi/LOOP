import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal } from "lucide-react";
import styles from "./ConversationDropdown.module.css";
import classNames from "classnames/bind";
import { useDispatch } from "react-redux";

// Import các component nút đã được cấu hình type="in/out"
import ToggleMuteButton from "../../MenuConversation/ToggleMuteButton/ToggleMuteButton";
import ToggleRestrictButton from "../../MenuConversation/ToggleRestrictButton/ToggleRestrictButton";
import BlockButton from "../../MenuConversation/BlockButton/BlockButton";

// Import logic xóa và modal
import { useDeleteConversation } from "../../../../hooks/useDeleteConversation";
import ConfirmModal from "../../../common/ConfirmModal/ConfirmModal";
import { removeConversationInState } from "../../../../redux/chatSlice";

const cx = classNames.bind(styles);

const ConversationDropdown = ({ conversation, currentUser, isMuted }) => {
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [menuCoords, setMenuCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  // Lấy thông tin người kia để truyền vào BlockButton
  const otherUser = conversation.participants.find(
    (p) => p._id !== currentUser?._id,
  );

  // LOGIC XÓA CUỘC TRÒ CHUYỆN
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { executeDelete, isDeleting } = useDeleteConversation();

  const handleConfirmDelete = async () => {
    const result = await executeDelete(conversation._id);
    if (result.success) {
      setShowDeleteModal(false);
      dispatch(removeConversationInState(conversation._id));
    } else {
      console.error(result.message);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setIsOpen(false); // Đóng menu dropdown
    setShowDeleteModal(true); // Mở modal xác nhận xóa
  };

  // Tính toán vị trí và bật/tắt menu
  const toggleMenu = (e) => {
    e.stopPropagation();
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuCoords({
        top: rect.bottom + window.scrollY + 8, // Cộng thêm 8px cho menu cách nút 1 chút
        left: rect.right - 160 + window.scrollX, // Căn sang trái 160px để không bị lẹm ra viền màn hình
      });
    }
    setIsOpen(!isOpen);
  };

  // Xử lý tự động đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        event.target.closest('[class*="modal"]') ||
        event.target.closest('[class*="overlay"]')
      ) {
        return;
      }

      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener("mousedown", handleClickOutside);
    }
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Xử lý khi click vào 1 mục trong menu để menu đóng lại
  const handleMenuContentClick = () => {
    setIsOpen(false);
  };

  return (
    <div className={cx("dropdown-container")}>
      <button
        ref={buttonRef}
        className={cx("more-btn", { active: isOpen })}
        onClick={toggleMenu}
      >
        <MoreHorizontal size={18} />
      </button>

      {/* PORTAL: Đẩy Menu ra ngoài body */}
      {isOpen &&
        createPortal(
          <div
            className={cx("dropdown-menu")}
            ref={menuRef}
            style={{ top: menuCoords.top, left: menuCoords.left }}
            onClick={handleMenuContentClick}
          >
            {/* Truyền type="out" để các nút này render dưới dạng item list thay vì nút khối tròn */}
            <ToggleMuteButton
              conversationId={conversation._id}
              initialIsMuted={isMuted}
              type="out"
              className={cx("menu-item")}
            />

            {/* Nút Xóa (vì logic xóa bạn đang để chung ở Menu hoặc Dropdown nên tự code giao diện list item) */}
            <button className={cx("menu-item")} onClick={handleDeleteClick}>
              Xóa cuộc trò chuyện
            </button>

            <ToggleRestrictButton
              conversationId={conversation._id}
              isRestricted={conversation.isRestricted} // Bạn kiểm tra lại biến này theo db của bạn
              type="out"
              className={cx("menu-item")}
            />

            <BlockButton
              targetUserId={otherUser?._id}
              type="out"
              className={cx("menu-item", "danger")}
            />
          </div>,
          document.body,
        )}

      {/* Modal xác nhận xóa cuộc trò chuyện (Luôn render ra ngoài cùng để không bị mất khi Dropdown đóng) */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={(e) => {
          if (e) e.stopPropagation();
          setShowDeleteModal(false);
        }}
        onConfirm={handleConfirmDelete}
        title="Xóa cuộc trò chuyện?"
        message={`Bạn sẽ không thể xem lại tin nhắn với ${
          otherUser?.name || "người này"
        }.`}
        isProcessing={isDeleting}
      />
    </div>
  );
};

export default ConversationDropdown;
