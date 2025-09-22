import styles from "./friendsPage.module.css";
import classNames from "classnames/bind";
import { useSelector } from "react-redux";
import { useState } from "react";
import { findnewfriend } from "../../services/Friends/findnewfriend";
import AddFriends from "../../component/friends/addfriends/addfriends";
import FriendsList from "../../component/friends/listfriend/listfriend";
import SentRequestList from "../../component/friends/sentrequestlist/sentrequestlist";
import FriendsRequestList from "../../component/friends/friendsrequest/friendrequest";

const cx = classNames.bind(styles);

function FriendsPage() {
  const [finduser, setFindUser] = useState(null);
  const [friendCode, setFriendCode] = useState("");
  const stateUser = useSelector((state) => state.user);
  const currentUser = stateUser?.user || null;
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
                <AddFriends currentUserId={currentUser._id} finduser={finduser} />
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
            <div className={cx("SentrequestList")}>
              <h3>Đã gửi</h3>
              {sentRequests.length > 0 ? (
                sentRequests.map((f, index) => (
                  <SentRequestList
                    key={f?.to?._id || f?.to || index}
                    currentUserId={currentUser._id}
                    id={f?.to?._id || f?.to}
                  />
                ))
              ) : (
                <p>Không có lời mời nào được gửi</p>
              )}
            </div>

            <div className={cx("requestSection")}>
              <h3>Đã nhận</h3>
              {friendRequests.length > 0 ? (
                friendRequests.map((f, index) => (
                  <FriendsRequestList
                    key={f?.From?._id || f?.from || index}
                    currentUserId={currentUser._id}
                    id={f?.from?._id || f?.from}
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
            {friends.length > 0 ? (
              friends.map((f) => (
                <FriendsList key={f} currentUserId={currentUser._id} id={f} />
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
