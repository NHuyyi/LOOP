// src/components/FriendsList/FriendsList.js
import { useEffect, useState } from "react";
import styles from "./sentRequests.module.css";
import classNames from "classnames/bind";
import { getUserbyId } from "../../services/User/getUserbyId";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/userSlice";
import { cancelRequest } from "../../services/Friends/cancleRequest";
const cx = classNames.bind(styles);

function SendRequestList({ currentUserId, id }) {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await getUserbyId(id); // giả sử service này trả về object user

        setInfo(res);
      } catch (err) {
        console.error("Lỗi lấy user:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchInfo();
  }, [id]);

  const handleCancel = async () => {
    await cancelRequest(currentUserId, id);
    const updatedUser = await getUserbyId(currentUserId);
    dispatch(
      setUser({ user: updatedUser, token: localStorage.getItem("token") })
    );
  };

  if (loading) return <div className={cx("spinner-border text-light")}></div>;

  return (
    <div className={cx("infoItem")}>
      <img
        src={info.avatar || "/default-avatar.png"}
        alt={info.name}
        className={cx("avatar")}
      />

      <div className={cx("info")}>
        <span className={cx("name")}>{info.name || info.username}</span>
        <div className={cx("friendCode")}>Mã: {info.friendCode}</div>
      </div>
      <button className={cx("removeButton")} onClick={handleCancel}>
        Hủy yêu cầu
      </button>
    </div>
  );
}

export default SendRequestList;
