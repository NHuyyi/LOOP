// src/components/FriendsList/SendRequestList.js
import { useState } from "react";
import styles from "./sentRequests.module.css";
import classNames from "classnames/bind";
import { useDispatch } from "react-redux";

// Import action từ friendSlice thay vì userSlice
import { removeSentRequestLocal } from "../../../redux/friendSlice";
import { cancelRequest } from "../../../services/Friends/cancleRequest";

import Loading from "../../Loading/Loading";
const cx = classNames.bind(styles);

// Đổi prop `id` thành `userData`
function SendRequestList({ currentUserId, userData }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch = useDispatch();

  // Nếu không có dữ liệu thì không render
  if (!userData) return null;

  const handleCancel = async () => {
    try {
      setIsProcessing(true);
      await cancelRequest(currentUserId, userData._id);
      // Sử dụng action local vừa tạo
      dispatch(removeSentRequestLocal(userData._id));
    } catch (err) {
      console.error("Lỗi khi hủy yêu cầu:", err);
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
        className={cx("removeButton")}
        onClick={handleCancel}
        disabled={isProcessing} // Chặn bấm 2 lần liên tục
      >
        {isProcessing ? <Loading size="small" /> : "Hủy yêu cầu"}
      </button>
    </div>
  );
}

export default SendRequestList;
