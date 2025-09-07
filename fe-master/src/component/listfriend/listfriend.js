// src/components/FriendsList/FriendsList.js
import { useEffect, useState } from "react";
import styles from "./FriendsList.module.css";
import classNames from "classnames/bind";
import { getUserbyId } from "../../services/User/getUserbyId";
import { UserRoundX } from "lucide-react";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/userSlice";
import { removeFriend } from "../../services/Friends/removefriend";

const cx = classNames.bind(styles);

function FriendsList({ currentUserId, id }) {
  const [friend, setFriend] = useState(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchFriend = async () => {
      try {
        const res = await getUserbyId(id); // giả sử service này trả về object user
        setFriend(res);
      } catch (err) {
        console.error("Lỗi lấy user:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchFriend();
  }, [id]);

  const handleRemoveFriend = async () => {
    await removeFriend(currentUserId, id);
    const updatedUser = await getUserbyId(currentUserId);
    dispatch(
      setUser({ user: updatedUser, token: localStorage.getItem("token") })
    );
  };

  if (loading) return <div className={cx("spinner-border text-light")}></div>;

  return (
    <div className={cx("friendItem")}>
      <img
        src={friend.avatar || "/default-avatar.png"}
        alt={friend.name}
        className={cx("avatar")}
      />

      <div className={cx("info")}>
        <span className={cx("name")}>{friend.name || friend.username}</span>
        <div className={cx("friendCode")}>Mã: {friend.friendCode}</div>
      </div>
      <button className={cx("removeButton")} onClick={handleRemoveFriend}>
        <UserRoundX />
      </button>
    </div>
  );
}

export default FriendsList;
