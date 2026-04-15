// frontEnd/src/component/chat/MessageMenu/ForwardButton/ForwardButton.js
import React, { useState } from "react";
import ForwardModal from "./ForwardModel/ForwardModal"; // Import Modal vừa tạo

const ForwardButton = ({ message, closeMenu }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleForwardClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    closeMenu(); // Đóng luôn cả cái MessageMenu (popup chứa tùy chọn) sau khi chuyển tiếp xong hoặc bấm Hủy
  };

  return (
    <>
      <button onClick={handleForwardClick} className="menu-action-btn">
        Chuyển tiếp
      </button>

      {/* Render Modal ra màn hình khi isModalOpen = true */}
      {isModalOpen && (
        <ForwardModal message={message} onClose={handleCloseModal} />
      )}
    </>
  );
};

export default ForwardButton;
