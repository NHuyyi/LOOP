import styles from "./modelpostmini.module.css";
import classNames from "classnames/bind";
import { createPortal } from "react-dom";
import PostReaction from "../../post/PostReaction/PostReaction";
import ReactionCounts from "../../post/reactioncount/reactioncount";
import { useState } from "react";
import { useSelector } from "react-redux";
import { makeSelectCommentsByPostId } from "../../../redux/selectors";
import MiniCommentList from "../minicommentpost/minicommentList";

const cx = classNames.bind(styles);

function ModelPostMini({ post, onClose, userID }) {
  const [refreshKey, setRefreshKey] = useState(0);

  // ✅ Dùng selector thay vì inline [] mới
  const comments = useSelector(makeSelectCommentsByPostId(post._id));

  // Nếu đã mở commentList thì dùng dữ liệu redux để đếm chính xác
  const countComments = (arr) =>
    arr.reduce(
      (acc, c) => acc + (c.isDeleted ? 0 : 1) + countComments(c.replies || []),
      0,
    );

  const commentCount =
    comments.length > 0
      ? countComments(comments) // realtime khi đã load
      : post.commentCount || 0; // mặc định lấy từ BE

  let commentlength = commentCount;
  // 🔹 Lấy post mới nhất từ Redux để luôn đồng bộ
  const updatedPost = useSelector((state) =>
    state.posts.posts.find((p) => p._id === post._id),
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

          <div className={cx("action-bar")}>
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

            <div className={cx("comment-section")}>
              <button className={cx("actionButton")}>{commentlength} 💬</button>
            </div>
          </div>
          <div className={cx("comment-list-container")}>
            <MiniCommentList
              postId={currentPost._id}
              userID={userID._id}
              AuthorId={currentPost.author?._id}
            />
          </div>
        </div>

        <button className={cx("close-button")} onClick={onClose}>
          ×
        </button>
      </div>
    </div>,
    document.body,
  );
}

export default ModelPostMini;
