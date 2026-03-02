// src/components/FriendsList/FriendsRequestList.js
import { useState } from "react";
import styles from "./friendRequests.module.css";
import classNames from "classnames/bind";
import { useDispatch } from "react-redux";

// Import action từ friendSlice
import {
  acceptRequestLocal,
  rejectFriendRequest,
} from "../../../redux/friendSlice";
import { acceptRequest } from "../../../services/Friends/acceptRequest";
import { rejectRequest } from "../../../services/Friends/rejectRequest";
import { CircleCheckBig, CircleX } from "lucide-react";

const cx = classNames.bind(styles);

// Đổi prop `id` thành `userData`
function FriendsRequestList({ currentUserId, userData }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch = useDispatch();

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

  const handlereject = async () => {
    try {
      setIsProcessing(true);
      await rejectRequest(currentUserId, userData._id);

      // Tự động xóa người này khỏi Hộp thư đến
      dispatch(rejectFriendRequest(userData._id));
    } catch (err) {
      console.error("Lỗi khi từ chối:", err);
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
        onClick={handlereject}
        disabled={isProcessing}
      >
        <CircleX />
      </button>
    </div>
  );
}

export default FriendsRequestList;
