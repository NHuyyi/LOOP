import {
  UserRoundPlus,
  CircleX,
  CircleCheckBig,
  UserRoundX,
  MessageCircleMore,
} from "lucide-react";
import classNames from "classnames/bind";
import styles from "./addfriends.module.css";
import useFriendStatus from "../../hooks/checkfriend";
import { sendRequest } from "../../services/Friends/SendRequest";
import { acceptRequest } from "../../services/Friends/acceptRequest";
import { removeFriend } from "../../services/Friends/removefriend";
import { cancelRequest } from "../../services/Friends/cancleRequest";
import { rejectRequest } from "../../services/Friends/rejectRequest";
import { getUserbyId } from "../../services/User/getUserbyId";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/userSlice";

const cx = classNames.bind(styles);

function AddFriends({ currentUserId, finduser }) {
  const dispatch = useDispatch();
  const { status, setStatus, loading } = useFriendStatus(
    currentUserId,
    finduser._id
  );

  const handleSend = async () => {
    await sendRequest(currentUserId, finduser._id);
    const updatedUser = await getUserbyId(currentUserId); // fetch lại user đầy đủ
    dispatch(
      setUser({ user: updatedUser, token: localStorage.getItem("token") })
    );
    setStatus("requestSent");
  };

  const handleCancel = async () => {
    await cancelRequest(currentUserId, finduser._id);
    const updatedUser = await getUserbyId(currentUserId);
    dispatch(
      setUser({ user: updatedUser, token: localStorage.getItem("token") })
    );
    setStatus("none");
  };

  const handleRemoveFriend = async () => {
    await removeFriend(currentUserId, finduser._id);
    const updatedUser = await getUserbyId(currentUserId);
    dispatch(
      setUser({ user: updatedUser, token: localStorage.getItem("token") })
    );
    setStatus("none");
  };

  const handleAccept = async () => {
    await acceptRequest(currentUserId, finduser._id);
    const updatedUser = await getUserbyId(currentUserId);
    dispatch(
      setUser({ user: updatedUser, token: localStorage.getItem("token") })
    );
    setStatus("friends");
  };

  const handlereject = async () => {
    await rejectRequest(currentUserId, finduser._id);
    const updatedUser = await getUserbyId(currentUserId);
    dispatch(
      setUser({ user: updatedUser, token: localStorage.getItem("token") })
    );
    setStatus("none");
  };
  if (loading) return <p>Đang tải...</p>;
  return (
    <div className={cx("container")}>
      <div className={cx("userCard")}>
        <span>{finduser.name}</span>

        {status === "none" && (
          <button className={cx("addButton")} onClick={handleSend}>
            <UserRoundPlus />
          </button>
        )}

        {status === "requestSent" && (
          <button className={cx("cancelButton")} onClick={handleCancel}>
            Hủy yêu cầu
          </button>
        )}
        {status === "requestReceived" && (
          <div className={cx("requestReceivedActions")}>
            <button className={cx("acceptButton")} onClick={handleAccept}>
              <CircleCheckBig />
            </button>
            <button className={cx("rejectButton")} onClick={handlereject}>
              <CircleX />
            </button>
          </div>
        )}

        {status === "friends" && (
          <div className={cx("friendActions")}>
            <button className={cx("msgButton")}>
              <MessageCircleMore />
            </button>
            <button className={cx("removeButton")} onClick={handleRemoveFriend}>
              <UserRoundX />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddFriends;
