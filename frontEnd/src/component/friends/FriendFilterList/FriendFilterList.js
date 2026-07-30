import { useState, useEffect } from "react";
import styles from "./FriendFilterList.module.css";
import classNames from "classnames/bind";
import { useSelector, useDispatch } from "react-redux";
import getFriendListFilter from "../../../services/Friends/getFriendListFilter";
import { setFilteredFriends } from "../../../redux/friendSlice";
import { OpenMiniChat, ToggleMiniChatWindow } from "../../../redux/chatSlice";
import UserListItem from "../../user/UserListItem/UserListItem";
import Loading from "../../Loading/Loading";

const cx = classNames.bind(styles);

function FriendFilterList() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // Lấy thông tin user và danh sách bạn bè đã filter từ Redux
  const stateUser = useSelector((state) => state.user);
  const currentUser = stateUser?.user;
  const filteredFriends = useSelector((state) => state.friend.filteredFriends);

  const conversations = useSelector((state) => state.chat.ConversationList);

  useEffect(() => {
    const fetchFilteredFriends = async () => {
      // Logic quan trọng: Chỉ gọi API nếu mảng trong Redux đang rỗng
      if (
        currentUser?._id &&
        (!filteredFriends || filteredFriends.length === 0)
      ) {
        setLoading(true);
        try {
          const res = await getFriendListFilter(currentUser._id);
          if (res.success) {
            // Đẩy dữ liệu vào Redux. (Lưu ý: Tùy theo cấu trúc trả về của API mà bạn truyền res.data hoặc res.friends nhé)
            dispatch(setFilteredFriends(res.data));
          }
        } catch (error) {
          console.error("Lỗi khi tải danh sách người liên hệ:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFilteredFriends();
  }, [currentUser, filteredFriends, dispatch]);

  const handleClick = (friend) => {
    const existingConv = conversations?.find((conv) =>
      conv.participants?.some((p) => p._id === friend._id || p === friend._id),
    );

    const conversationId = existingConv ? existingConv._id : null;

    dispatch(
      OpenMiniChat({
        receiver: friend,
        conversationId: conversationId,
        triggerBy: "socket", // Gắn cờ "user" để chỉ định người dùng chủ động mở, giúp cửa sổ bật lên thay vì chỉ hiện bong bóng
      }),
    );

    dispatch(
      ToggleMiniChatWindow({
        receiverId: friend._id,
        isOpen: true,
      }),
    );
  };

  return (
    <div>
      <h3 className={cx("title")}>Liên Hệ Nhanh</h3>

      {loading && <Loading size="small" />}

      {!loading && filteredFriends && filteredFriends.length > 0 && (
        <div className={cx("friend-list-wrapper")}>
          {filteredFriends.map((friend) => (
            <UserListItem
              key={friend._id}
              id={friend._id}
              avatar={friend.avatar}
              name={friend.name}
              onClick={() => handleClick(friend)}
            />
          ))}
        </div>
      )}

      {!loading && (!filteredFriends || filteredFriends.length === 0) && (
        <p className={cx("text-gray-500 text-sm mt-2")}>Không có gợi ý nào.</p>
      )}
    </div>
  );
}

export default FriendFilterList;
