import styles from "./HomePage.module.css";
import classNames from "classnames/bind";
import CreatePost from "../../component/creatpost/creatpost";
import PostCard from "../../component/postItem/PostCard";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useGetPost } from "../../hooks/getpost";
import { useDispatch } from "react-redux";
import { updateReaction } from "../../redux/reactionSlide";
import countreaction from "../../services/Post/countreaction";

const cx = classNames.bind(styles);

function HomePage() {
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [fadeOut, setFadeOut] = useState(false);

  // Lấy user hiện tại từ redux
  const stateUser = useSelector((state) => state.user);
  const currentUser = stateUser?.user;

  // Gọi hook lấy danh sách bài viết
  const { posts, loading } = useGetPost(
    currentUser?.friends || [],
    currentUser?._id
  );

  // lưu vào redux
  const dispatch = useDispatch();

  // Khi posts thay đổi, đẩy dữ liệu reaction ban đầu vào Redux
  useEffect(() => {
    posts.forEach(async (post) => {
      const res = await countreaction(post._id);
      if (res.success) {
        dispatch(
          updateReaction({
            postId: post._id,
            reactionCounts: res.data.reactionCounts,
            totalReactions: res.data.totalReactions,
          })
        );
      }
    });
  }, [posts, dispatch]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setFadeOut(true), 2500);
      const removeTimer = setTimeout(() => {
        setMessage("");
        setFadeOut(false);
      }, 3000);

      return () => {
        clearTimeout(timer);
        clearTimeout(removeTimer);
      };
    }
  }, [message]);

  return (
    <div className={cx("home-container")}>
      <div className={cx("content")}>
        <CreatePost setMessage={setMessage} setSuccess={setSuccess} />

        {/* Loading */}
        {loading && <p className="text-center">Đang tải bài viết...</p>}

        {/* Danh sách bài viết */}
        {!loading && posts.length > 0 && (
          <div>
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                currentUserId={currentUser?._id}
              />
            ))}
          </div>
        )}

        {/* Không có bài viết */}
        {!loading && posts.length === 0 && (
          <p className="text-center text-gray-500">Chưa có bài viết nào</p>
        )}
      </div>

      {message && (
        <div
          className={`${cx("app-message")}  
                          ${
                            success === false
                              ? cx("app-message__err")
                              : cx("app-message__ok")
                          } ${fadeOut ? cx("fade-out") : ""}`}
        >
          {message}
        </div>
      )}
    </div>
  );
}

export default HomePage;
