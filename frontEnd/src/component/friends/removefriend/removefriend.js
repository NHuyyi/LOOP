import { removeFriend } from "../../../services/Friends/removefriend";
import classNames from "classnames/bind";
import styles from "./Removefriend.module.css";
import { getUserbyId } from "../../../services/User/getUserbyId";
import { useDispatch } from "react-redux";
import { setUser } from "../../../redux/userSlice";
import { createPortal } from "react-dom";

const cx = classNames.bind(styles);

function Removefriend({ currentUserId, id, name, onClose }) {
  const dispatch = useDispatch();
  const handleRemoveFriend = async () => {
    await removeFriend(currentUserId, id);
    const updatedUser = await getUserbyId(currentUserId);
    dispatch(
      setUser({ user: updatedUser, token: localStorage.getItem("token") })
    );
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
    document.body
  );
}

export default Removefriend;
