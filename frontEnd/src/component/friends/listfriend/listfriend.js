// src/components/FriendsList/FriendsList.js
import { useEffect, useState } from "react";
import styles from "./FriendsList.module.css";
import classNames from "classnames/bind";
import { getUserbyId } from "../../../services/User/getUserbyId";
import { UserRoundX } from "lucide-react";
import { useSelector } from "react-redux";
import Removefriend from "../removefriend/removefriend";

const cx = classNames.bind(styles);

function FriendsList({ currentUserId, id }) {
  const [friend, setFriend] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const onlineUsers = useSelector((state) => state.online); // lấy danh sách userId đang online
  const isOnline = onlineUsers.includes(id);

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

  if (loading) return <div className={cx("spinner-border text-light")}></div>;

  return (
    <div className={cx("friendItem")}>
      <div className={cx("avatarWrapper")}>
        <img
          src={friend.avatar || "/default-avatar.png"}
          alt={friend.name}
          className={cx("avatar", { offline: !isOnline })}
        />
        {/* chấm trạng thái */}
        <span className={cx("statusDot", isOnline ? "online" : "offline")} />
      </div>

      <div className={cx("info")}>
        <span className={cx("name")}>{friend.name || friend.username}</span>
        <div className={cx("friendCode")}>Mã: {friend.friendCode}</div>
      </div>

      <button className={cx("removeButton")} onClick={() => setOpen(true)}>
        <UserRoundX />
      </button>
      {open && (
        <>
          <div className={cx("overlay")} onClick={() => setOpen(false)}></div>
          <Removefriend
            currentUserId={currentUserId}
            id={id}
            name={friend.name}
            onClose={() => setOpen(false)}
          />
        </>
      )}
    </div>
  );
}

export default FriendsList;
