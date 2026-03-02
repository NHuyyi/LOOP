// src/component/friends/listfriend/listfriend.js
import { useState } from "react";
import styles from "./FriendsList.module.css";
import classNames from "classnames/bind";
import { UserRoundX } from "lucide-react";
import { useSelector } from "react-redux";
import Removefriend from "../removefriend/removefriend";

const cx = classNames.bind(styles);

// Đổi prop `id` thành `userData`
function FriendsList({ currentUserId, userData }) {
  const [open, setOpen] = useState(false);

  const onlineUsers = useSelector((state) => state.online);
  // Kiểm tra trạng thái online dựa trên ID nằm trong userData
  const isOnline = onlineUsers.includes(userData._id);

  // Không cần useEffect hay loading nữa, vì dữ liệu có sẵn ngay lập tức!
  if (!userData) return null;

  return (
    <div className={cx("friendItem")}>
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

      <button className={cx("removeButton")} onClick={() => setOpen(true)}>
        <UserRoundX />
      </button>

      {open && (
        <Removefriend
          currentUserId={currentUserId}
          id={userData._id} // Nhớ truyền ID cho Removefriend để nó gọi API xóa
          name={userData.name}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

export default FriendsList;
