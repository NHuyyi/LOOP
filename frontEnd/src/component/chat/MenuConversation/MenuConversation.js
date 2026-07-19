import React, { useState, useEffect } from "react";
import style from "./MenuConversation.module.css";
import classNames from "classnames/bind";
import { X, Pen, Search, User, ArrowLeft } from "lucide-react";
import SearchOldMessages from "./SearchOldMessages/SearchOldMessages";
import { useDeleteConversation } from "../../../hooks/useDeleteConversation";
import ConfirmModal from "../../common/ConfirmModal/ConfirmModal";
import { useDispatch } from "react-redux";
import { removeConversationInState } from "../../../redux/chatSlice";
import { getConversationImages } from "../../../services/chat/getConversationImages";
import SharedImages from "./SharedImages/SharedImages";
import ToggleMuteButton from "./ToggleMuteButton/ToggleMuteButton";
import ToggleRestrictButton from "./ToggleRestrictButton/ToggleRestrictButton";

const cx = classNames.bind(style);

function MenuConverSation({
  isOpen,
  onClose,
  otherUser,
  isOnline,
  conversationId,
  initialIsMuted,
  isRestricted,
}) {
  // State quản lý việc đang ở màn hình menu hay màn hình tìm kiếm
  const [isSearchMode, setIsSearchMode] = useState(false);

  const [isImageMode, setIsmageMode] = useState(false);

  // Xử lý khi đóng menu thì reset lại state tìm kiếm luôn
  const handleCloseMenu = () => {
    setIsSearchMode(false);
    setIsmageMode(false);
    onClose();
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { executeDelete, isDeleting } = useDeleteConversation();

  const dispatch = useDispatch();

  const [chatImages, setChatImages] = useState([]);

  useEffect(() => {
    if (isOpen && conversationId) {
      const fetchImages = async () => {
        const res = await getConversationImages(conversationId);
        if (res.success) {
          setChatImages(res.images.map((img) => img.imageUrl));
        }
      };
      fetchImages();
    }
  }, [isOpen, conversationId]);

  const recentImagePreview = chatImages.slice(0, 3);

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
                  onClick={() => {
                    setIsSearchMode(false);
                  }}
                >
                  <ArrowLeft size={24} />
                </button>
                <span style={{ fontSize: "16px" }}>Tìm kiếm tin nhắn</span>
                <div style={{ width: "36px" }}></div>{" "}
                {/* Thẻ div rỗng để cân bằng UI */}
              </>
            ) : isImageMode ? (
              <>
                {/* Nút quay lại menu chính */}
                <button
                  className={cx("closeBtn")}
                  onClick={() => {
                    setIsmageMode(false);
                  }}
                >
                  <ArrowLeft size={24} />
                </button>
                <span style={{ fontSize: "16px" }}>Danh sách ảnh</span>
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
            ) : isImageMode ? (
              <SharedImages chatImages={chatImages} />
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
                  <ToggleMuteButton
                    conversationId={conversationId}
                    initialIsMuted={initialIsMuted}
                  />
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
                  <div className={cx("imageGrid")}>
                    {recentImagePreview.length > 0 ? (
                      recentImagePreview.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`img-${index}`}
                          className={cx("gridImage")}
                        />
                      ))
                    ) : (
                      <span
                        style={{
                          fontSize: "13px",
                          color: "gray",
                          paddingBottom: "10px",
                        }}
                      >
                        Chưa có ảnh nào
                      </span>
                    )}
                  </div>
                  {chatImages.length > 3 && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "12px",
                        marginBottom: "8px",
                      }}
                    >
                      <button
                        style={{
                          background:
                            "rgba(0, 132, 255, 0.1)" /* Thêm chút nền xanh nhạt cho giống Facebook/Zalo */,
                          border: "none",
                          color: "#0084ff",
                          cursor: "pointer",
                          fontSize: "14px",
                          fontWeight: "500",
                          padding: "8px 16px",
                          borderRadius: "6px",
                          width:
                            "100%" /* Nếu muốn nút trải dài hết chiều ngang thì giữ width 100%, không thì bỏ đi */,
                          transition: "0.2s",
                        }}
                        onClick={() => setIsmageMode(true)}
                        onMouseOver={(e) =>
                          (e.target.style.background = "rgba(0, 132, 255, 0.2)")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.background = "rgba(0, 132, 255, 0.1)")
                        }
                      >
                        Xem tất cả
                      </button>
                    </div>
                  )}
                </div>

                <div className={cx("Btn-group")}>
                  <button className={cx("reportBtn")}>Báo cáo</button>
                  <ToggleRestrictButton
                    conversationId={conversationId}
                    // logic kiểm tra xem cuộc trò chuyện có nằm trong RestrictedConversationList không
                    isRestricted={isRestricted} // Truyền biến check trạng thái vào đây
                    className={cx("cancelBtn")}
                  />
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
