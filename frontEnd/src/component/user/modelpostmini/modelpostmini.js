import styles from "./modelpostmini.module.css";
import classNames from "classnames/bind";
import { createPortal } from "react-dom";
import PostReaction from "../../post/PostReaction/PostReaction";
import { useState } from "react";

const cx = classNames.bind(styles);

function ModelPostMini({ post, onClose, userID }) {
  const reactions = post.reactions || [];
  const [refreshKey, setRefreshKey] = useState(0);
  return createPortal(
    <div className={cx("overlay")} onClick={onClose}>
      <div className={cx("modal")} onClick={(e) => e.stopPropagation()}>
        {/* LEFT: IMAGE */}
        <div className={cx("left")}>
          <img src={post?.imageUrl} alt="Post" className={cx("post-image")} />
          <div className={cx("post-details")}>
            <div className={cx("author-info")}>
              <img
                src={
                  post?.author?.avatar ||
                  "https://res.cloudinary.com/dpym64zg9/image/upload/v1755614090/raw_cq4nqn.png"
                }
                alt={post?.author?.name || "Unknown User"}
                className={cx("author-avatar")}
              />
              <span className={cx("author-name")}>
                {post?.author?.name || "Unknown User"}
              </span>
            </div>

            <p className={cx("post-content")}>
              {post?.content || "No content available."}
            </p>
          </div>
        </div>

        {/* RIGHT: CONTENT */}
        <div className={cx("right")}>
          <div className={cx("reaction-bar")}>
            <PostReaction
              postId={post._id}
              userID={userID}
              reactionType={
                reactions.find((r) => r.user === userID)?.type || ""
              }
              onReacted={() => setRefreshKey((k) => k + 1)}
            />
          </div>
          <div className={cx("comment-section")}></div>
        </div>

        <button className={cx("close-button")} onClick={onClose}>
          ×
        </button>
      </div>
    </div>,
    document.body
  );
}

export default ModelPostMini;
