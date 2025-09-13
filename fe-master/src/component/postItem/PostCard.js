import { useState } from "react";
import styles from "./PostCard.module.css";
import classNames from "classnames/bind";
import PostReaction from "../PostReaction/PostReaction";
import ReactionCounts from "../reactioncount/reactioncount";
import AddComment from "../addComment/addComment";

const cx = classNames.bind(styles);

function PostCard({ post, currentUserId }) {
  const [showComments, setShowComments] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // 👈 thêm state

  const reactions = post.reactions || [];

  return (
    <div className={cx("postCard")}>
      {/* Author */}
      <div className={cx("author")}>
        <div className={cx("authorInfo")}>
          <img
            src={
              post.author?.avatar ||
              "https://res.cloudinary.com/dpym64zg9/image/upload/v1755614090/raw_cq4nqn.png"
            }
            alt="avatar"
            className={cx("authorAvatar")}
          />
          <div>
            <p className={cx("authorName")}>{post.author?.name || "ẩn danh"}</p>
          </div>
        </div>
        <p className={cx("authorDate")}>
          {new Date(post.createdAt).toLocaleString()}
        </p>
      </div>

      {/* Image */}
      {post.imageUrl && (
        <div className={cx("postImage")}>
          <img src={post.imageUrl} alt="post" />
        </div>
      )}

      {/* Content */}
      {post.content && <p className={cx("postContent")}>{post.content}</p>}

      {/* Reaction count */}
      <div className={cx("reactionCount")}>
        <ReactionCounts
          key={refreshKey}
          postId={post._id}
          currentUserId={currentUserId}
          postAuthorId={post.author._id}
        />
      </div>

      {/* Action bar */}
      <div className={cx("actionBar")}>
        <PostReaction
          postId={post._id}
          userID={currentUserId} // Giả sử bạn có userID của người dùng hiện tại
          reactionType={
            reactions.find((r) => r.user === currentUserId)?.type || ""
          }
          onReacted={() => setRefreshKey((k) => k + 1)} // 👈 callback
        />
        <button
          onClick={() => setShowComments(!showComments)}
          className={cx("actionButton")}
        >
          💬 Bình luận
        </button>
      </div>
      <AddComment postId={post._id} />
    </div>
  );
}

export default PostCard;
