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

// Import Redux Actions (KHÔNG DÙNG userSlice NỮA)
import { addSentRequest, acceptRequestLocal } from "../../../redux/friendSlice";

import Removefriend from "../removefriend/removefriend";
const cx = classNames.bind(styles);

function AddFriends({ currentUserId, finduser }) {
  const dispatch = useDispatch();
  const { status, setStatus, loading } = useFriendStatus(
    currentUserId,
    finduser._id,
  );
  const [open, setOpen] = useState(false);
  const [Type, setType] = useState("");

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

  const handleAccept = async () => {
    try {
      setIsProcessing(true);
      await acceptRequest(currentUserId, finduser._id);

      setStatus("friends");
      dispatch(acceptRequestLocal(finduser._id));
    } catch (error) {
      console.error("Lỗi chấp nhận kết bạn", error);
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
            onClick={() => {
              setOpen(true);
              setType("cancelRequest");
            }}
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
              onClick={() => {
                setOpen(true);
                setType("rejectRequest");
              }}
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
              onClick={() => {
                setOpen(true);
                setType("removeFriend");
              }}
              disabled={isProcessing}
            >
              {isProcessing ? "..." : <UserRoundX />}
            </button>
          </div>
        )}
      </div>
      {open && (
        <Removefriend
          type={Type}
          currentUserId={currentUserId}
          id={finduser._id} // Nhớ truyền ID cho Removefriend để nó gọi API xóa
          name={finduser.name}
          onClose={() => setOpen(false)}
          onSuccess={() => setStatus("none")}
        />
      )}
    </div>
  );
}

export default AddFriends;
