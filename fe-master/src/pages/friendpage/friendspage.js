import styles from "./friendsPage.module.css";
import classNames from "classnames/bind";
import { useSelector } from "react-redux";
import { useState } from "react";
import { findnewfriend } from "../../services/Friends/findnewfriend";
import AddFriends from "../../component/addfriends/addfriends";
import FriendsList from "../../component/listfriend/listfriend";
import SentRequestList from "../../component/sentrequestlist/sentrequestlist";
import FriendsRequestList from "../../component/friendsrequest/friendrequest";

const cx = classNames.bind(styles);

function FriendsPage() {
  const [finduser, setFindUser] = useState(null);
  const [friendCode, setFriendCode] = useState("");
  const stateUser = useSelector((state) => state.user);
  const currentUser = stateUser?.user || null; // an toàn hơn
  const friends = currentUser?.friends || [];
  const sentRequests = currentUser?.sentRequests || [];
  const friendRequests = currentUser?.friendRequests || [];
  const [abbert, setAbbert] = useState("");

  const handleFindNewFriend = async () => {
    try {
      setFindUser(null);

      if (!currentUser?._id) {
        setAbbert("Bạn chưa đăng nhập hoặc thiếu thông tin người dùng.");
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

  return (
    <div className={cx("container")}>
      <h1 className={cx("app-title")}>Bạn bè</h1>

      {/* Thanh tìm kiếm bạn mới */}
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

      {/* Kết quả tìm kiếm */}
      <div className={cx("card")}>
        <h2 className={cx("app-title")}>Kết quả tìm kiếm</h2>
        {finduser ? (
          <div className={cx("userCard")}>
            {currentUser?._id && (
              <AddFriends currentUserId={currentUser._id} finduser={finduser} />
            )}
          </div>
        ) : abbert ? (
          <p>{abbert}</p>
        ) : (
          <p>Chưa có kết quả</p>
        )}
      </div>
      <div className={cx("card")}>
        <h2 className={cx("app-title")}>Lời mời kết bạn</h2>

        <div className={cx("requestTabs")}>
          {/* Tab Gửi đi */}
          <div className={cx("SentrequestList")}>
            <h3>Đã gửi</h3>
            {sentRequests && sentRequests.length > 0 ? (
              sentRequests.map((f, index) => (
                <SentRequestList
                  key={f?.to?._id || f?.to || index}
                  currentUserId={currentUser._id}
                  id={f?.to?._id || f?.to}
                />
              ))
            ) : (
              <p>Trống</p>
            )}
          </div>

          {/* Tab Nhận được */}
          <div className={cx("requestSection")}>
            <h3>Đã nhận</h3>
            {friendRequests && friendRequests.length > 0 ? (
              friendRequests.map((f, index) => (
                <FriendsRequestList
                  key={f?.From?._id || f?.from || index}
                  currentUserId={currentUser._id}
                  id={f?.from?._id || f?.from}
                />
              ))
            ) : (
              <p>Trống</p>
            )}
          </div>
        </div>
      </div>

      {/* Danh sách bạn bè */}
      <div className={cx("card")}>
        <h2 className={cx("app-title")}>Danh sách bạn bè</h2>

        {/* Nếu chưa có currentUser (chưa load) */}
        <div className={cx("friendsList")}>
          {friends && friends.length > 0 ? (
            friends.map((f) => (
              <FriendsList key={f} currentUserId={currentUser._id} id={f} />
            ))
          ) : (
            <p>Nhanh thêm bạn nào</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default FriendsPage;
