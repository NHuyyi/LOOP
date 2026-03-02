import styles from "./friendsPage.module.css";
import classNames from "classnames/bind";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";

// Import API services và Redux action
import { findnewfriend } from "../../services/Friends/findnewfriend";
import getFriendList from "../../services/Friends/getFriendList"; // Đảm bảo bạn đã có file này trong mục services
import { setFriendData } from "../../redux/friendSlice";

// Import Components
import AddFriends from "../../component/friends/addfriends/addfriends";
import FriendsList from "../../component/friends/listfriend/listfriend";
import SentRequestList from "../../component/friends/sentrequestlist/sentrequestlist";
import FriendsRequestList from "../../component/friends/friendsrequest/friendrequest";

const cx = classNames.bind(styles);

function FriendsPage() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.user);

  // 🟢 Lấy dữ liệu Real-time trực tiếp từ friendSlice
  const { friends, friendRequests, sentRequests } = useSelector(
    (state) => state.friend,
  );

  const [finduser, setFindUser] = useState(null);
  const [friendCode, setFriendCode] = useState("");
  const [abbert, setAbbert] = useState("");
  const [loading, setLoading] = useState(true);

  // 🟢 Gọi API 1 lần duy nhất khi load trang để lấy dữ liệu chuẩn từ DB
  useEffect(() => {
    const fetchFriends = async () => {
      if (currentUser?._id) {
        try {
          const res = await getFriendList(currentUser._id);
          if (res?.success) {
            // Ném toàn bộ data vào Redux, từ nay UI sẽ tự động đồng bộ
            dispatch(setFriendData(res));
          }
        } catch (error) {
          console.error("Lỗi khi tải danh sách bạn bè:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchFriends();
  }, [currentUser?._id, dispatch]);

  const handleFindNewFriend = async () => {
    try {
      setFindUser(null);
      setAbbert("");
      if (!currentUser?._id) {
        setAbbert("Bạn chưa đăng nhập.");
        return;
      }
      const response = await findnewfriend(friendCode, currentUser._id);
      if (response?.success) {
        setFindUser(response.newfriend);
      } else {
        setAbbert(response?.message || "Không tìm thấy người dùng");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      setAbbert("Có lỗi xảy ra khi tìm kiếm.");
    }
  };

  if (loading) return <div className={cx("loading")}>Đang tải dữ liệu...</div>;

  return (
    <div className={cx("container")}>
      <h1 className={cx("app-title")}>Bạn Của Tôi</h1>

      {/* Tìm kiếm bạn mới */}
      <div className={cx("section")}>
        <div className={cx("searchBox")}>
          <input
            type="text"
            placeholder="🔍 Nhập mã bạn bè..."
            value={friendCode}
            onChange={(e) => setFriendCode(e.target.value)}
          />
          <button onClick={handleFindNewFriend} className="app-btn">
            Tìm
          </button>
        </div>

        <div className={cx("card")}>
          <h2 className={cx("section-title")}>Kết quả tìm kiếm</h2>
          {finduser ? (
            <div className={cx("userCard")}>
              {currentUser?._id && (
                <AddFriends
                  currentUserId={currentUser._id}
                  finduser={finduser}
                />
              )}
            </div>
          ) : abbert ? (
            <p>{abbert}</p>
          ) : (
            <p>Chưa có kết quả</p>
          )}
        </div>
      </div>

      {/* Lời mời kết bạn */}
      <div className={cx("section")}>
        <div className={cx("card")}>
          <h2 className={cx("section-title")}>Lời mời kết bạn</h2>
          <div className={cx("requestTabs")}>
            {/* 🟢 Lời mời ĐÃ GỬI (sentRequests) */}
            <div className={cx("SentrequestList")}>
              <h3>Đã Gửi</h3>
              {sentRequests.length > 0 ? (
                sentRequests.map((req, index) => (
                  <SentRequestList
                    key={req.to?._id || index}
                    currentUserId={currentUser._id}
                    userData={req.to} // TRUYỀN THẲNG OBJECT USER
                  />
                ))
              ) : (
                <p>Không có lời mời nào được gửi</p>
              )}
            </div>

            {/* 🟢 Lời mời ĐÃ NHẬN (friendRequests) */}
            <div className={cx("requestSection")}>
              <h3>Đã Nhận</h3>
              {friendRequests.length > 0 ? (
                friendRequests.map((req, index) => (
                  <FriendsRequestList
                    key={req.from?._id || index}
                    currentUserId={currentUser._id}
                    userData={req.from} // TRUYỀN THẲNG OBJECT USER
                  />
                ))
              ) : (
                <p>Hộp thư rỗng rồi, kết bạn ngay thôi!</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách bạn bè */}
      <div className={cx("section")}>
        <div className={cx("card")}>
          <h2 className={cx("section-title")}>Danh sách bạn bè</h2>
          <div className={cx("friendsList")}>
            {/* 🟢 Danh sách bạn bè (friends) */}
            {friends.length > 0 ? (
              friends.map((friend) => (
                <FriendsList
                  key={friend._id}
                  currentUserId={currentUser._id}
                  userData={friend} // TRUYỀN THẲNG OBJECT USER
                />
              ))
            ) : (
              <p>Nhanh thêm bạn nào</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FriendsPage;
