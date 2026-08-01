import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Lấy ID bạn bè từ URL
import { useSelector } from "react-redux";
import classNames from "classnames/bind";
import styles from "./FriendProfilePage.module.css";

// Services & Components
import { getUserbyId } from "../../services/User/getUserbyId";
import ProfileHeader from "../../component/user/ProfileHeader/ProfileHeader";
import ProfileActions from "../../component/user/ProfileActions/ProfileActions"; // Tái sử dụng ProfileActions
import PostCard from "../../component/post/postItem/PostCard"; // Tái sử dụng PostCard
import Loading from "../../component/Loading/Loading";

const cx = classNames.bind(styles);

function FriendProfilePage() {
  const { id } = useParams(); // URL: /friend/:id
  const currentUser = useSelector((state) => state.user.user);
  const posts = useSelector((state) => state.posts.posts);

  const [friendData, setFriendData] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log(
    "posts",
    useSelector((state) => state.posts),
  );

  // Lấy thông tin bạn bè
  useEffect(() => {
    const fetchFriendInfo = async () => {
      setLoading(true);
      try {
        const res = await getUserbyId(id);
        if (res) setFriendData(res);
      } catch (error) {
        console.error("Lỗi fetch user:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchFriendInfo();
  }, [id]);

  if (loading) return <Loading fullScreen text="Đang tải thông tin..." />;
  if (!friendData)
    return (
      <div className="text-center mt-5">Không tìm thấy thông tin bạn bè</div>
    );

  // Lọc bài viết của người này từ Redux
  const friendPosts = posts.filter(
    (p) => p.author?._id === String(id) || p.author === id,
  );

  return (
    <div className={cx("profile-container")}>
      <div className={cx("profile-card")}>
        <ProfileHeader friendData={friendData} />
        <ProfileActions friendData={friendData} currentUser={currentUser} />
      </div>

      <div className={cx("feed-section")}>
        <h3 className={cx("feed-title")}>Bài viết của {friendData.name}</h3>
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
          <p className={cx("no-posts")}>Chưa có bài viết nào.</p>
        )}
      </div>
    </div>
  );
}

export default FriendProfilePage;
