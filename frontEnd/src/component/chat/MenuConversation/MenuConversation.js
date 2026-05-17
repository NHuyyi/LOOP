import React, { useState } from "react";
import style from "./MenuConversation.module.css";
import classNames from "classnames/bind";
// Thêm ArrowLeft để làm nút quay lại
import { X, Pen, Search, Bell, User, ArrowLeft } from "lucide-react";
// Import Component tìm kiếm (Đổi đường dẫn cho đúng với project của bạn)
import SearchOldMessages from "./SearchOldMessages/SearchOldMessages";
import { useDeleteConversation } from "../../../hooks/useDeleteConversation";
import ConfirmModal from "../../common/ConfirmModal/ConfirmModal";
import { useDispatch } from "react-redux";
import { removeConversationInState } from "../../../redux/chatSlice";

const cx = classNames.bind(style);

// LƯU Ý: Thêm prop 'conversationId' để truyền vào cho MessageSearch
function MenuConverSation({
  isOpen,
  onClose,
  otherUser,
  isOnline,
  conversationId,
}) {
  // State quản lý việc đang ở màn hình menu hay màn hình tìm kiếm
  const [isSearchMode, setIsSearchMode] = useState(false);

  // Xử lý khi đóng menu thì reset lại state tìm kiếm luôn
  const handleCloseMenu = () => {
    setIsSearchMode(false);
    onClose();
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { executeDelete, isDeleting } = useDeleteConversation();

  const dispatch = useDispatch();

  if (!isOpen || !otherUser) return null;

  const handleConfirmDelete = async () => {
    const result = await executeDelete(conversationId);

    if (result.success) {
      setShowDeleteModal(false); // Đóng modal
      onClose(); // Đóng luôn cả menu bên phải
      dispatch(removeConversationInState(conversationId)); // Xóa conversation khỏi state Redux
    } else {
      // Bạn có thể tạo 1 state errorMessage để hiển thị lỗi ngay trong modal
      console.error(result.message);
    }
  };
  return (
    <>
      <div className={cx("overlay")} onClick={handleCloseMenu}>
        <div
          className={cx("menu")}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {/* --- HEADER --- */}
          <div className={cx("header")}>
            {isSearchMode ? (
              <>
                {/* Nút quay lại menu chính */}
                <button
                  className={cx("closeBtn")}
                  onClick={() => setIsSearchMode(false)}
                >
                  <ArrowLeft size={24} />
                </button>
                <span style={{ fontSize: "16px" }}>Tìm kiếm tin nhắn</span>
                <div style={{ width: "36px" }}></div>{" "}
                {/* Thẻ div rỗng để cân bằng UI */}
              </>
            ) : (
              <>
                Thông tin cuộc trò chuyện
                <button className={cx("closeBtn")} onClick={handleCloseMenu}>
                  <X size={24} />
                </button>
              </>
            )}
          </div>

          {/* --- CONTENT --- */}
          <div className={cx("content")}>
            {isSearchMode ? (
              /* ========================================= */
              /* GIAO DIỆN KHI BẤM TÌM KIẾM        */
              /* ========================================= */
              <div className={cx("searchWrapper")}>
                <SearchOldMessages conversationId={conversationId} />
              </div>
            ) : (
              /* ========================================= */
              /* GIAO DIỆN MENU BÌNH THƯỜNG        */
              /* ========================================= */
              <>
                <div className={cx("userInfo")}>
                  <div className={cx("avatarWrapper")}>
                    <img
                      src={
                        otherUser.avatar ||
                        "https://res.cloudinary.com/dpym64zg9/image/upload/v1755614090/raw_cq4nqn.png"
                      }
                      alt="avatar"
                      className={cx("avatar", isOnline ? "online" : "offline")}
                    />
                    <span
                      className={cx(
                        "statusDot",
                        isOnline ? "online" : "offline",
                      )}
                    />
                  </div>
                  <div className={cx("details")}>
                    <div className={cx("name")}>{otherUser.name}</div>
                    <div className={cx("editIcon")}>
                      <Pen size={16} />
                    </div>
                  </div>
                </div>

                <div className={cx("actions")}>
                  <button className={cx("actionBtn")}>
                    <Bell size={24} />
                  </button>
                  <button className={cx("actionBtn")}>
                    <User size={24} />
                  </button>
                  {/* BẤM NÚT NÀY SẼ CHUYỂN SANG MODE TÌM KIẾM */}
                  <button
                    className={cx("actionBtn")}
                    onClick={() => setIsSearchMode(true)}
                  >
                    <Search size={24} />
                  </button>
                </div>

                <div className={cx("images")}>
                  <h4 className={cx("sectionTitle")}>Ảnh</h4>
                  <div className={cx("line")}></div>
                  <div className={cx("imageGrid")}></div>
                </div>

                <div className={cx("Btn-group")}>
                  <button className={cx("reportBtn")}>Báo cáo</button>
                  <button className={cx("cancelBtn")}>Hạn chế</button>
                  <button
                    className={cx("deleteBtn")}
                    onClick={() => setShowDeleteModal(true)}
                  >
                    Xóa cuộc trò chuyện
                  </button>
                  <button className={cx("blockBtn")}>Chặn người dùng</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Xóa cuộc trò chuyện?"
        message={`Bạn sẽ không thể xem lại tin nhắn với ${otherUser.name}. Tuy nhiên, người kia vẫn có thể nhìn thấy lịch sử trò chuyện này.`}
        isProcessing={isDeleting}
      />
    </>
  );
}

export default MenuConverSation;
