import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Lấy ID bạn bè từ URL
import { useSelector, useDispatch } from "react-redux";
import classNames from "classnames/bind";
import styles from "./FriendProfilePage.module.css";

// Services & Components
import { getUserbyId } from "../../services/User/getUserbyId";
import { getFriendStreakLeaderboard } from "../../services/streak/streakServices";
import { useGetPost } from "../../hooks/getpost";
import ProfileHeader from "../../component/user/ProfileHeader/ProfileHeader";
import ProfileActions from "../../component/user/ProfileActions/ProfileActions"; // Tái sử dụng ProfileActions
import ProfileInfoCard from "../../component/user/ProfileInfoCard/ProfileInfoCard";
import PostCard from "../../component/post/postItem/PostCard"; // Tái sử dụng PostCard
import Loading from "../../component/Loading/Loading";
import { setPosts } from "../../redux/postSlice";
const cx = classNames.bind(styles);

function FriendProfilePage() {
  const { id } = useParams(); // URL: /friend/:id
  const currentUser = useSelector((state) => state.user.user);
  const posts = useSelector((state) => state.posts.posts);

  const dispatch = useDispatch();

  const [friendData, setFriendData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [friendStreak, setFriendStreak] = useState(0); // Chuỗi nhắn tin với bạn này

  const navigate = useNavigate();

  const { posts: fetchedPosts, loading: loadingPosts } = useGetPost(
    currentUser?.friends || [],
    currentUser?._id,
  );

  useEffect(() => {
    if (fetchedPosts && fetchedPosts.length > 0) {
      dispatch(setPosts(fetchedPosts));
    }
  }, [fetchedPosts, dispatch]);

  // Lấy thông tin bạn bè và streak
  useEffect(() => {
    if (!currentUser || !currentUser._id) return;
    const fetchFriendInfo = async () => {
      setLoading(true);
      try {
        const [res, leaderboardRes] = await Promise.all([
          getUserbyId(id),
          getFriendStreakLeaderboard(),
        ]);

        // Thay thế đoạn kiểm tra cũ bằng đoạn này:
        const isFriend = res.friends?.some(
          (friend) => String(friend._id || friend) === String(currentUser?._id)
        );

        if (res && isFriend) {
          setFriendData(res);

          // Tìm streak của bạn này trong leaderboard
          if (leaderboardRes?.success && Array.isArray(leaderboardRes.data)) {
            const entry = leaderboardRes.data.find(
              (item) => String(item.userId) === String(id)
            );
            setFriendStreak(entry?.streak || 0);
          }
        } else {
          navigate("/home");
        }
      } catch (error) {
        console.error("Lỗi fetch user:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchFriendInfo();
  }, [id, navigate, currentUser]);

  if (loading || loadingPosts)
    return <Loading fullScreen text="Đang tải thông tin..." />;
  if (!friendData)
    return (
      <div className="text-center mt-5">Không tìm thấy thông tin bạn bè</div>
    );

  // Lọc bài viết của người này từ Redux
  const friendPosts = posts.filter(
    (p) => p.author?._id === String(id) || p.author === id,
  );

  const totalFriends = friendData.friends?.length || 0;
  const totalPosts = friendPosts.length;
  // Tính tổng reaction (dựa vào mảng reactions hoặc trường totalReactions)
  const totalReactions = friendPosts.reduce(
    (sum, post) => sum + (post.totalReactions || post.reactions?.length || 0),
    0,
  );
  // Tính tổng comment (dựa vào trường commentCount)
  const totalComments = friendPosts.reduce(
    (sum, post) => sum + (post.commentCount || 0),
    0,
  );

  const stats = { totalFriends, totalPosts, totalReactions, totalComments };

  const safeProfile = (friendData?.profile && typeof friendData.profile === "object")
    ? friendData.profile
    : {};

  return (
    <div className={cx("profile-layout")}>
      <div className={cx("profile-card")}>
        <ProfileHeader friendData={friendData} stats={stats} />
        <ProfileActions friendData={friendData} currentUser={currentUser} />
      </div>

      {/* Thông tin cá nhân: chỉ hiện nếu có profile */}
      <ProfileInfoCard
        profile={safeProfile}
        isOwner={false}
        streak={friendStreak}
        posts={friendPosts}
        currentUser={currentUser}
      />

      <div className={cx("feed-section")}>
        <div className={cx("feed-header")}>
          <h3 className={cx("feed-title")}>Bài viết gần đây</h3>
        </div>

        <div className={cx("feed-content")}>
          {friendPosts.length > 0 ? (
            friendPosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                currentUserId={currentUser._id}
                friendList={currentUser.friends || []}
              />
            ))
          ) : (
            <div className={cx("no-posts")}>
              <img
                src="https://cdn-icons-png.flaticon.com/512/7486/7486754.png"
                alt="No posts"
                className={cx("empty-icon")}
              />
              <p>Chưa có bài viết nào.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FriendProfilePage;
