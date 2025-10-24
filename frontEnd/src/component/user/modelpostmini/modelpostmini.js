import styles from "./modelpostmini.module.css";
import classNames from "classnames/bind";
import { createPortal } from "react-dom";
import PostReaction from "../../post/PostReaction/PostReaction";
import ReactionCounts from "../../post/reactioncount/reactioncount";
import { useState } from "react";
import { useSelector } from "react-redux";

const cx = classNames.bind(styles);

function ModelPostMini({ post, onClose, userID }) {
  const [refreshKey, setRefreshKey] = useState(0);

  // 🔹 Lấy post mới nhất từ Redux để luôn đồng bộ
  const updatedPost = useSelector((state) =>
    state.posts.posts.find((p) => p._id === post._id)
  );

  // 🔹 Fallback nếu Redux chưa có post (lúc mới mở)
  const currentPost = updatedPost || post;
  const reactions = currentPost.reactions || [];
  return createPortal(
    <div className={cx("overlay")} onClick={onClose}>
      <div className={cx("modal")} onClick={(e) => e.stopPropagation()}>
        {/* LEFT: IMAGE */}
        <div className={cx("left")}>
          <img
            src={currentPost?.imageUrl}
            alt="Post"
            className={cx("post-image")}
          />
          <div className={cx("post-details")}>
            <div className={cx("author-info")}>
              <img
                src={
                  currentPost?.author?.avatar ||
                  "https://res.cloudinary.com/dpym64zg9/image/upload/v1755614090/raw_cq4nqn.png"
                }
                alt={currentPost?.author?.name || "Unknown User"}
                className={cx("author-avatar")}
              />
              <span className={cx("author-name")}>
                {currentPost?.author?.name || "Unknown User"}
              </span>
            </div>

            <p className={cx("post-content")}>
              {currentPost?.content || "No content available."}
            </p>
          </div>
        </div>

        {/* RIGHT: CONTENT */}
        <div className={cx("right")}>
          <div className={cx("reaction-counts")}>
            <ReactionCounts
              postId={currentPost._id}
              postAuthorId={currentPost.author?._id}
              currentUserId={userID._id}
              key={refreshKey}
            />
          </div>

          <div className={cx("reaction-bar")}>
            <PostReaction
              postId={currentPost._id}
              userID={userID._id}
              reactionType={
                reactions.find((r) => r.user === userID._id)?.type || ""
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
