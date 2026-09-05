import styles from "./miniprofile.module.css";
import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

function MiniPost({ post = [], user }) {
  const navigate = useNavigate();

  return (
    <div className={cx("minipost")}>
      {post.length > 0 ? (
        post.slice(0, 6).map((p) => (
          <button
            key={p._id}
            onClick={() => navigate(`/post/${p._id}`)}
          >
            <img
              src={p.imageUrl || "/default-post.png"}
              alt="Post"
              className={cx("image")}
            />
          </button>
        ))
      ) : (
        <p className={cx("no-posts")}>Không có bài viết nào</p>
      )}
    </div>
  );
}

export default MiniPost;