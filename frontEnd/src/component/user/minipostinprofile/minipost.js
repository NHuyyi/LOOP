import styles from "./miniprofile.module.css";
import classNames from "classnames/bind";
import { useState } from "react";
import ModelPostMini from "../modelpostmini/modelpostmini";

const cx = classNames.bind(styles);

function MiniPost({ post = [], user }) {
  const [open, setOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  console.log("MiniPost received posts:", open);
  return (
    <div className={cx("minipost")}>
      {post.length > 0 ? (
        post.slice(0, 6).map((p) => (
          <button
            key={p._id}
            onClick={() => {
              setOpen(true);
              setSelectedPost(p);
            }}
          >
            <img
              key={p._id}
              src={p.imageUrl || "/default-post.png"}
              alt="Post"
              className={cx("image")}
            />
          </button>
        ))
      ) : (
        <p className={cx("no-posts")}>Không có bài viết nào</p>
      )}
      {open && (
        <>
          <ModelPostMini
            post={selectedPost}
            onClose={() => setOpen(false)}
            userID={user}
          />
        </>
      )}
    </div>
  );
}

export default MiniPost;
