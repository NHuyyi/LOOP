import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  OpenMiniChat,
  ToggleMiniChatWindow,
  setInitialBlockStatus,
} from "../../../redux/chatSlice";
import classNames from "classnames/bind";
import styles from "./ProfileActions.module.css";
import {
  MessageCircleMore,
  MoreHorizontal,
  BellOff,
  UserMinus,
  Flag,
} from "lucide-react";

// Import các component chức năng
import Removefriend from "../../../component/friends/removefriend/removefriend";
import BlockButton from "../../chat/MenuConversation/BlockButton/BlockButton";
import checkBlockStatus from "../../../services/User/checkBlockStatus";

const cx = classNames.bind(styles);

function ProfileActions({ friendData, currentUser }) {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const menuRef = useRef(null); // Ref dùng để bắt sự kiện click ra ngoài menu

  const blockStatus = useSelector((state) => state.chat.blockStatus) || {};
  const isChatDisabled =
    blockStatus.isBlockedByMe || blockStatus.isBlockedByThem;

  // Lấy list conversation từ Redux để kiểm tra trạng thái Mute (cho icon chuông)
  const conversations = useSelector((state) => state.chat.ConversationList);
  const existingConv = conversations?.find((conv) =>
    conv.participants?.some(
      (p) => p._id === friendData._id || p === friendData._id,
    ),
  );

  const conversationId = existingConv ? existingConv._id : null;
  const isMuted = existingConv?.mutedBy?.includes(currentUser._id);

  useEffect(() => {
    if (friendData?._id) {
      checkBlockStatus(friendData._id)
        .then((res) => {
          if (res.success) {
            // Dispatch thẳng vào Redux, lúc này BlockButton sẽ tự động nhận diện được trạng thái
            dispatch(
              setInitialBlockStatus({
                isBlockedByMe: res.data.isBlockedByMe,
                isBlockedByThem: res.data.isBlockedByThem,
              }),
            );
          }
        })
        .catch((err) => console.error("Lỗi lấy trạng thái chặn:", err));
    }
  }, [friendData?._id, dispatch]);

  const handleOpenMiniChat = () => {
    if (isChatDisabled) return;

    dispatch(
      OpenMiniChat({
        receiver: friendData,
        conversationId: conversationId,
        triggerBy: "click",
      }),
    );
    dispatch(
      ToggleMiniChatWindow({
        receiverId: friendData._id,
        isOpen: true,
      }),
    );
  };

  // Đóng dropdown menu khi người dùng click ra ngoài vùng menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div className={cx("actions-section")}>
      <button
        className={cx("app-btn", "msg-btn", { disabled: isChatDisabled })}
        onClick={handleOpenMiniChat}
        disabled={isChatDisabled}
      >
        <MessageCircleMore size={20} />
        <span>Nhắn tin</span>
        {isMuted && <BellOff size={16} className={cx("mute-icon")} />}
      </button>

      {/* 2. MENU DROPDOWN DÀNH CHO PROFILE */}
      <div className={cx("menu-wrapper")} ref={menuRef}>
        <button
          className={cx("app-btn", "more-btn")}
          onClick={() => setShowMenu(!showMenu)}
        >
          <MoreHorizontal size={20} />
        </button>

        {showMenu && (
          <div className={cx("dropdown-menu")}>
            {/* Chức năng: XÓA BẠN */}
            <button
              className={cx("menu-item")}
              onClick={() => {
                setShowRemoveModal(true);
                setShowMenu(false);
              }}
            >
              <UserMinus size={16} />
              <span>Xóa bạn bè</span>
            </button>

            {/* Chức năng: CHẶN (Sử dụng lại BlockButton, type="out" để render dạng list) */}
            <div className={cx("menu-item")}>
              <BlockButton targetUserId={friendData._id} type="out" />
            </div>

            {/* Chức năng: BÁO CÁO */}
            <button
              className={cx("menu-item", "text-danger")}
              onClick={() => {
                // Logic API báo cáo xử lý sau
                setShowMenu(false);
              }}
            >
              <Flag size={16} />
              <span>Báo cáo trang cá nhân</span>
            </button>
          </div>
        )}
      </div>

      {/* MODAL XÓA BẠN */}
      {showRemoveModal && (
        <Removefriend
          type="removeFriend"
          currentUserId={currentUser._id}
          id={friendData._id}
          name={friendData.name}
          onClose={() => setShowRemoveModal(false)}
          onSuccess={() => navigate("/home")}
        />
      )}
    </div>
  );
}

export default ProfileActions;
