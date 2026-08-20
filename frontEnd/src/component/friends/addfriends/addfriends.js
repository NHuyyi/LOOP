import { useState } from "react";
import {
  UserRoundPlus,
  CircleX,
  CircleCheckBig,
  UserRoundX,
  MessageCircleMore,
  ShieldAlert
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
import Loading from "../../Loading/Loading";
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

  if (loading) return <Loading text="Đang Tải..." />;

  const isAllowRequests = finduser.allowFriendRequests !== false;

  return (
    <div className={cx("container")}>
      <div className={cx("userCard")}>
        <span>{finduser.name || finduser.username}</span>
        {/* nút gửi yêu cầu */}
        {status === "none" && (
          <>
            {isAllowRequests ? (
              // Nếu cho phép kết bạn -> Hiện nút Thêm bạn
              <button
                className={cx("addButton")}
                onClick={handleSend}
                disabled={isProcessing}
                title="Thêm bạn bè"
              >
                {isProcessing ? <Loading size="small" /> : <UserRoundPlus />}
              </button>
            ) : (
              // Nếu TẮT kết bạn -> Ẩn nút Thêm bạn và có thể hiện Icon báo hiệu riêng tư
              <button
                className={cx("cancelButton")}
                style={{ background: "#e4e6eb", color: "#65676b", cursor: "not-allowed" }}
                disabled
                title="Người này không nhận lời mời kết bạn"
              >
                <ShieldAlert size={18} />
              </button>
            )}
          </>
        )}
        {/* Nút Hủy Yêu Cầu */}
        {status === "requestSent" && (
          <button
            className={cx("cancelButton")}
            onClick={() => {
              setOpen(true);
              setType("cancelRequest");
            }}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <Loading size="small" text="Đang xử lý..." />
            ) : (
              "Hủy yêu cầu"
            )}
          </button>
        )}
        {status === "requestReceived" && (
          <div className={cx("requestReceivedActions")}>
            {/* Nút Chấp Nhận Yêu Cầu */}
            <button
              className={cx("acceptButton")}
              onClick={handleAccept}
              disabled={isProcessing}
            >
              {isProcessing ? <Loading size="small" /> : <CircleCheckBig />}
            </button>
            {/* Nút Từ Chối Yêu Cầu */}
            <button
              className={cx("rejectButton")}
              onClick={() => {
                setOpen(true);
                setType("rejectRequest");
              }}
              disabled={isProcessing}
            >
              {isProcessing ? <Loading size="small" /> : <CircleX />}
            </button>
          </div>
        )}

        {status === "friends" && (
          <div className={cx("friendActions")}>
            <button className={cx("msgButton")} disabled={isProcessing}>
              <MessageCircleMore />
            </button>
            {/* Nút Xóa bạn */}
            <button
              className={cx("removeButton")}
              onClick={() => {
                setOpen(true);
                setType("removeFriend");
              }}
              disabled={isProcessing}
            >
              {isProcessing ? <Loading size="small" /> : <UserRoundX />}
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
