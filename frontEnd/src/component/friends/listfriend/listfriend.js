// src/component/friends/listfriend/listfriend.js
import { useState } from "react";
import styles from "./FriendsList.module.css";
import classNames from "classnames/bind";
import { MessageCircleMore, UserRoundX } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import Removefriend from "../removefriend/removefriend";
import { OpenMiniChat, ToggleMiniChatWindow } from "../../../redux/chatSlice";
import { useNavigate } from "react-router-dom";
const cx = classNames.bind(styles);

// Đổi prop `id` thành `userData`
function FriendsList({ currentUserId, userData }) {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const onlineUsers = useSelector((state) => state.online);
  // Kiểm tra trạng thái online dựa trên ID nằm trong userData
  const isOnline = onlineUsers.includes(userData._id);
  const conversations = useSelector((state) => state.chat.ConversationList);
  const navigate = useNavigate();

  const handleGoToProfile = () => {
    // Điều hướng đến trang friend kèm theo ID của user đó
    navigate(`/friend/${userData._id}`);
  };
  // Không cần useEffect hay loading nữa, vì dữ liệu có sẵn ngay lập tức!
  if (!userData) return null;

  const handleClick = (userData) => {
    const existingConv = conversations?.find((conv) =>
      conv.participants?.some(
        (p) => p._id === userData._id || p === userData._id,
      ),
    );

    const conversationId = existingConv ? existingConv._id : null;

    dispatch(
      OpenMiniChat({
        receiver: userData,
        conversationId: conversationId,
        triggerBy: "socket", // Gắn cờ "user" để chỉ định người dùng chủ động mở, giúp cửa sổ bật lên thay vì chỉ hiện bong bóng
      }),
    );

    dispatch(
      ToggleMiniChatWindow({
        receiverId: userData._id,
        isOpen: true,
      }),
    );
  };

  return (
    <div className={cx("friendItem")} onClick={handleGoToProfile}>
      <div className={cx("avatarWrapper")}>
        <img
          src={userData.avatar || "/default-avatar.png"}
          alt={userData.name}
          className={cx("avatar", { offline: !isOnline })}
        />
        <span className={cx("statusDot", isOnline ? "online" : "offline")} />
      </div>

      <div className={cx("info")}>
        <span className={cx("name")}>{userData.name || userData.username}</span>
        <div className={cx("friendCode")}>Mã: {userData.friendCode}</div>
      </div>

      <button
        className={cx("chatButton")}
        onClick={(e) => {
          e.stopPropagation();
          handleClick(userData);
        }}
      >
        <MessageCircleMore />
      </button>

      <button className={cx("removeButton")} onClick={(e) => { e.stopPropagation(); setOpen(true) }}>
        <UserRoundX />
      </button>

      {open && (
        <Removefriend
          type="removeFriend"
          currentUserId={currentUserId}
          id={userData._id} // Nhớ truyền ID cho Removefriend để nó gọi API xóa
          name={userData.name}
          onClose={() => setOpen(false)}
          onSuccess={() => setOpen(false)} // Đóng modal sau khi xóa thành công
        />
      )}
    </div>
  );
}

export default FriendsList;
