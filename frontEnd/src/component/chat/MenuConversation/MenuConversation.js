import React, { useState } from "react";
import style from "./MenuConversation.module.css";
import classNames from "classnames/bind";
// Thêm ArrowLeft để làm nút quay lại
import { X, Pen, Search, Bell, User, ArrowLeft } from "lucide-react";
// Import Component tìm kiếm (Đổi đường dẫn cho đúng với project của bạn)
import SearchOldMessages from "./SearchOldMessages/SearchOldMessages";

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

  if (!isOpen || !otherUser) return null;

  // Xử lý khi đóng menu thì reset lại state tìm kiếm luôn
  const handleCloseMenu = () => {
    setIsSearchMode(false);
    onClose();
  };

  return (
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
                    className={cx("statusDot", isOnline ? "online" : "offline")}
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
                <button className={cx("deleteBtn")}>Xóa cuộc trò chuyện</button>
                <button className={cx("blockBtn")}>Chặn người dùng</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MenuConverSation;
