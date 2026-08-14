import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import classNames from "classnames/bind";
import styles from "../FriendProfilePage/FriendProfilePage.module.css"; // Tái sử dụng luôn CSS của FriendProfilePage

// Services & Components
import { useGetPost } from "../../hooks/getpost";
import ProfileHeader from "../../component/user/ProfileHeader/ProfileHeader";
import ProfileActions from "../../component/user/ProfileActions/ProfileActions";
import ProfileInfoCard from "../../component/user/ProfileInfoCard/ProfileInfoCard";
import PostCard from "../../component/post/postItem/PostCard";
import CreatePost from "../../component/post/creatpost/creatpost"; // Khác với bạn bè, trang cá nhân nên có thêm phần đăng bài
import Loading from "../../component/Loading/Loading";
import { setPosts } from "../../redux/postSlice";

const cx = classNames.bind(styles);

function MyProfilePage() {
    const currentUser = useSelector((state) => state.user.user);
    const posts = useSelector((state) => state.posts.posts);
    const dispatch = useDispatch();

    // Load lại post nếu cần (hoặc dùng thẳng từ Redux nếu đã load ở trang Home)
    const { posts: fetchedPosts, loading: loadingPosts } = useGetPost(
        currentUser?.friends || [],
        currentUser?._id,
    );

    useEffect(() => {
        if (fetchedPosts && fetchedPosts.length > 0) {
            dispatch(setPosts(fetchedPosts));
        }
    }, [fetchedPosts, dispatch]);

    if (!currentUser) return <Loading fullScreen text="Đang tải thông tin..." />;

    // Lọc chỉ lấy bài viết của BẢN THÂN MÌNH
    const myPosts = posts.filter(
        (p) => p.author?._id === String(currentUser._id) || p.author === currentUser._id,
    );

    // Thống kê thông tin cá nhân
    const totalFriends = currentUser.friends?.length || 0;
    const totalPosts = myPosts.length;

    const totalReactions = myPosts.reduce(
        (sum, post) => sum + (post.totalReactions || post.reactions?.length || 0),
        0,
    );

    const totalComments = myPosts.reduce(
        (sum, post) => sum + (post.commentCount || 0),
        0,
    );

    const stats = { totalFriends, totalPosts, totalReactions, totalComments };

    const safeProfile = (currentUser?.profile && typeof currentUser.profile === "object")
        ? currentUser.profile
        : {};


    return (
        <div className={cx("profile-layout")}>
            <div className={cx("profile-card")}>
                {/* Tận dụng lại ProfileHeader và ProfileActions */}
                <ProfileHeader friendData={currentUser} stats={stats} />
                <ProfileActions friendData={currentUser} currentUser={currentUser} />
            </div>

            {/* Thông tin cá nhân đầy đủ */}
            <ProfileInfoCard
                profile={safeProfile}
                isOwner={true}
                posts={myPosts}
                currentUser={currentUser}
            />

            <div className={cx("feed-section")}>
                <div className={cx("feed-header")}>
                    <h3 className={cx("feed-title")}>Bài viết của bạn</h3>
                </div>

                {/* Khung đăng bài mới (có thể giữ hoặc bỏ tùy bạn) */}
                <CreatePost
                    setMessage={() => { }}
                    setSuccess={() => { }}
                    friendList={currentUser?.friends || []}
                />

                <div className={cx("feed-content")} style={{ marginTop: "16px" }}>
                    {loadingPosts ? <Loading /> : myPosts.length > 0 ? (
                        myPosts.map((post) => (
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

export default MyProfilePage;