import { useState } from "react";
import {
  UserRoundPlus,
  CircleX,
  CircleCheckBig,
  UserRoundX,
  MessageCircleMore,
} from "lucide-react";
import classNames from "classnames/bind";
import styles from "./addfriends.module.css";
import useFriendStatus from "../../../hooks/checkfriend";
import { useDispatch } from "react-redux";

// Import API Services
import { sendRequest } from "../../../services/Friends/SendRequest";
import { acceptRequest } from "../../../services/Friends/acceptRequest";
import { removeFriend as removeFriendAPI } from "../../../services/Friends/removefriend";
import { cancelRequest } from "../../../services/Friends/cancleRequest";
import { rejectRequest } from "../../../services/Friends/rejectRequest";

// Import Redux Actions (KHÔNG DÙNG userSlice NỮA)
import {
  addSentRequest,
  removeSentRequestLocal,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend as removeFriendRedux,
} from "../../../redux/friendSlice";

const cx = classNames.bind(styles);

function AddFriends({ currentUserId, finduser }) {
  const dispatch = useDispatch();
  const { status, setStatus, loading } = useFriendStatus(
    currentUserId,
    finduser._id,
  );
  console.log("Trạng thái bạn bè:", finduser._id, status);

  // Trạng thái chờ API để làm hiệu ứng loading cho nút
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSend = async () => {
    try {
      setIsProcessing(true);
      await sendRequest(currentUserId, finduser._id);

      setStatus("requestSent");
      // Bắn vào Redux để danh sách "Đã gửi" tự update mượt mà
      dispatch(addSentRequest(finduser));
    } catch (error) {
      console.error("Lỗi gửi yêu cầu", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    try {
      setIsProcessing(true);
      await cancelRequest(currentUserId, finduser._id);

      setStatus("none");
      // Xóa khỏi danh sách "Đã gửi"
      dispatch(removeSentRequestLocal(finduser._id));
    } catch (error) {
      console.error("Lỗi hủy yêu cầu", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveFriend = async () => {
    try {
      setIsProcessing(true);
      await removeFriendAPI(currentUserId, finduser._id);

      setStatus("none");
      dispatch(removeFriendRedux(finduser._id));
    } catch (error) {
      console.error("Lỗi xóa bạn", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAccept = async () => {
    try {
      setIsProcessing(true);
      await acceptRequest(currentUserId, finduser._id);

      setStatus("friends");
      dispatch(acceptFriendRequest(finduser._id));
    } catch (error) {
      console.error("Lỗi chấp nhận kết bạn", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlereject = async () => {
    try {
      setIsProcessing(true);
      await rejectRequest(currentUserId, finduser._id);

      setStatus("none");
      dispatch(rejectFriendRequest(finduser._id));
    } catch (error) {
      console.error("Lỗi từ chối kết bạn", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <p>Đang tải...</p>;

  return (
    <div className={cx("container")}>
      <div className={cx("userCard")}>
        <span>{finduser.name || finduser.username}</span>

        {status === "none" && (
          <button
            className={cx("addButton")}
            onClick={handleSend}
            disabled={isProcessing}
          >
            {isProcessing ? "..." : <UserRoundPlus />}
          </button>
        )}

        {status === "requestSent" && (
          <button
            className={cx("cancelButton")}
            onClick={handleCancel}
            disabled={isProcessing}
          >
            {isProcessing ? "Đang xử lý..." : "Hủy yêu cầu"}
          </button>
        )}

        {status === "requestReceived" && (
          <div className={cx("requestReceivedActions")}>
            <button
              className={cx("acceptButton")}
              onClick={handleAccept}
              disabled={isProcessing}
            >
              {isProcessing ? "..." : <CircleCheckBig />}
            </button>
            <button
              className={cx("rejectButton")}
              onClick={handlereject}
              disabled={isProcessing}
            >
              {isProcessing ? "..." : <CircleX />}
            </button>
          </div>
        )}

        {status === "friends" && (
          <div className={cx("friendActions")}>
            <button className={cx("msgButton")} disabled={isProcessing}>
              <MessageCircleMore />
            </button>
            <button
              className={cx("removeButton")}
              onClick={handleRemoveFriend}
              disabled={isProcessing}
            >
              {isProcessing ? "..." : <UserRoundX />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddFriends;
