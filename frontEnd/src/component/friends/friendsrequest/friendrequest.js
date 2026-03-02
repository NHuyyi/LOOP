// src/components/FriendsList/FriendsRequestList.js
import { useState } from "react";
import styles from "./friendRequests.module.css";
import classNames from "classnames/bind";
import { useDispatch } from "react-redux";

// Import action từ friendSlice
import { acceptRequestLocal } from "../../../redux/friendSlice";
import { acceptRequest } from "../../../services/Friends/acceptRequest";

import { CircleCheckBig, CircleX } from "lucide-react";
import Removefriend from "../removefriend/removefriend";
const cx = classNames.bind(styles);

// Đổi prop `id` thành `userData`
function FriendsRequestList({ currentUserId, userData }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  if (!userData) return null;

  const handleAccept = async () => {
    try {
      setIsProcessing(true);
      await acceptRequest(currentUserId, userData._id);
      // Gọi action local xử lý trên mảng friendRequests
      dispatch(acceptRequestLocal(userData._id));
    } catch (err) {
      console.error("Lỗi khi chấp nhận:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={cx("infoItem")}>
      <img
        src={userData.avatar || "/default-avatar.png"}
        alt={userData.name}
        className={cx("avatar")}
      />
      <div className={cx("info")}>
        <span className={cx("name")}>{userData.name || userData.username}</span>
        <div className={cx("friendCode")}>Mã: {userData.friendCode}</div>
      </div>
      <button
        className={cx("acceptButton")}
        onClick={handleAccept}
        disabled={isProcessing}
      >
        <CircleCheckBig />
      </button>
      <button
        className={cx("rejectButton")}
        onClick={() => setOpen(true)}
        disabled={isProcessing}
      >
        <CircleX />
      </button>
      {open && (
        <Removefriend
          type="rejectRequest"
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

export default FriendsRequestList;
