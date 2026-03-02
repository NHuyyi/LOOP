import { removeFriend as removeFriendAPI } from "../../../services/Friends/removefriend";
import classNames from "classnames/bind";
import styles from "./Removefriend.module.css";
import { useDispatch } from "react-redux";
import { removeFriend } from "../../../redux/friendSlice";
import { createPortal } from "react-dom";

const cx = classNames.bind(styles);

function Removefriend({ currentUserId, id, name, onClose, onSuccess }) {
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

  return createPortal(
    <div className={cx("overlay")} onClick={onClose}>
      <div
        className={cx("container-remove")}
        onClick={(e) => e.stopPropagation()}
      >
        <span>Bạn có chắc muốn xóa kết bạn với {name}</span>
        <button className={cx("submitbutton")} onClick={handleRemoveFriend}>
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
