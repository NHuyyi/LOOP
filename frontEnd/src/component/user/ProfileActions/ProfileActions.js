import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { OpenMiniChat, ToggleMiniChatWindow } from "../../../redux/chatSlice";
import classNames from "classnames/bind";
import styles from "../../../pages/FriendProfilePage/FriendProfilePage.module.css";
import { MessageCircleMore, MoreHorizontal } from "lucide-react";

// Tái sử dụng component Xóa bạn
import Removefriend from "../../../component/friends/removefriend/removefriend";

const cx = classNames.bind(styles);

function ProfileActions({ friendData, currentUser }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  // Lấy list conversation để kiểm tra xem đã từng chat chưa
  const conversations = useSelector((state) => state.chat.ConversationList);

  const handleOpenMiniChat = () => {
    // Tìm cuộc hội thoại cũ nếu có
    const existingConv = conversations?.find((conv) =>
      conv.participants?.some(
        (p) => p._id === friendData._id || p === friendData._id,
      ),
    );
    const conversationId = existingConv ? existingConv._id : null;

    // Dispatch hành động mở MiniChat
    dispatch(
      OpenMiniChat({
        receiver: friendData,
        conversationId: conversationId,
        triggerBy: "click", // Kích hoạt bằng click để mở to cửa sổ
      }),
    );
    dispatch(
      ToggleMiniChatWindow({
        receiverId: friendData._id,
        isOpen: true,
      }),
    );
  };

  return (
    <div className={cx("actions-section")}>
      <button className={cx("app-btn", "msg-btn")} onClick={handleOpenMiniChat}>
        <MessageCircleMore size={20} />
        <span>Nhắn tin</span>
      </button>

      {/* Nút ... mở menu */}
      <div className={cx("menu-wrapper")}>
        <button
          className={cx("app-btn", "more-btn")}
          onClick={() => setShowMenu(!showMenu)}
        >
          <MoreHorizontal size={20} />
        </button>

        {showMenu && (
          <div className={cx("dropdown-menu")}>
            <button
              onClick={() => {
                setShowRemoveModal(true);
                setShowMenu(false);
              }}
            >
              Xóa bạn
            </button>
            {/* Các chức năng này bạn có thể import BlockButton, ToggleMuteButton từ chat/MenuConversation để tái sử dụng */}
            <button>Chặn</button>
            <button>Tắt thông báo</button>
            <button className={cx("text-danger")}>Báo cáo</button>
          </div>
        )}
      </div>

      {/* Component Xóa bạn đã có sẵn */}
      {showRemoveModal && (
        <Removefriend
          type="removeFriend"
          currentUserId={currentUser._id}
          id={friendData._id}
          name={friendData.name}
          onClose={() => setShowRemoveModal(false)}
        />
      )}
    </div>
  );
}

export default ProfileActions;
