import { removeFriend as removeFriendAPI } from "../../../services/Friends/removefriend";
import { rejectRequest } from "../../../services/Friends/rejectRequest";
import classNames from "classnames/bind";
import styles from "./Removefriend.module.css";
import { useDispatch } from "react-redux";
import { cancelRequest } from "../../../services/Friends/cancleRequest";

import {
  removeFriend,
  rejectFriendRequest,
  removeSentRequestLocal,
} from "../../../redux/friendSlice";
import { createPortal } from "react-dom";

const cx = classNames.bind(styles);

function Removefriend({ type, currentUserId, id, name, onClose, onSuccess }) {
  const dispatch = useDispatch();

  const handleRemoveFriend = async () => {
    try {
      const res = await removeFriendAPI(currentUserId, id);
      if (res.success) {
        //  Cập nhật Redux ngay lập tức để mất icon trên giao diện
        dispatch(removeFriend(id));
        //  Cập nhật trạng thái ở component cha (AddFriends)
        if (onSuccess) onSuccess();
        onClose(); // Đóng modal
      }
    } catch (err) {
      console.error("Lỗi khi xóa bạn:", err);
    }
  };

  const handlereject = async () => {
    try {
      const res = await rejectRequest(currentUserId, id);
      if (res.success) {
        // Tự động xóa người này khỏi Hộp thư đến
        dispatch(rejectFriendRequest(id));
        if (onSuccess) onSuccess();
        onClose(); // Đóng modal
      }
    } catch (err) {
      console.error("Lỗi khi từ chối:", err);
    }
  };

  const handleCancel = async () => {
    try {
      const res = await cancelRequest(currentUserId, id);

      if (res.success) {
        // Xóa khỏi danh sách "Đã gửi"
        dispatch(removeSentRequestLocal(id));
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Lỗi hủy yêu cầu", error);
    }
  };

  let props = {}; // Dùng let để có thể gán lại hoặc chỉnh sửa nội dung bên trong

  if (type === "removeFriend") {
    props.handle = handleRemoveFriend;
    props.title = `Bạn có chắc muốn xóa kết bạn với ${name}?`;
  } else if (type === "rejectRequest") {
    props.handle = handlereject;
    props.title = `Bạn có chắc muốn từ chối yêu cầu kết bạn từ ${name}?`;
  } else if (type === "cancelRequest") {
    props.handle = handleCancel;
    props.title = `Bạn có chắc muốn hủy yêu cầu kết bạn với ${name}?`;
  }

  return createPortal(
    <div className={cx("overlay")} onClick={onClose}>
      <div
        className={cx("container-remove")}
        onClick={(e) => e.stopPropagation()}
      >
        <span>{props.title}</span>
        <button className={cx("submitbutton")} onClick={props.handle}>
          Xác nhận{" "}
        </button>
        <button className={cx("cancelbutton")} onClick={onClose}>
          Hủy{" "}
        </button>
      </div>
    </div>,
    document.body,
  );
}

export default Removefriend;
