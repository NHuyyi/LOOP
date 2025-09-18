import { useState } from "react";
import { useSelector } from "react-redux";
import styles from "./PostCard.module.css";
import classNames from "classnames/bind";
import PostReaction from "../PostReaction/PostReaction";
import ReactionCounts from "../reactioncount/reactioncount";
import CommentList from "../../comment/commentlist/Commentlist";
import { CircleX } from "lucide-react";

const cx = classNames.bind(styles);

function PostCard({ post, currentUserId }) {
  const [showComments, setShowComments] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Lấy danh sách comment từ Redux store
  const comments = useSelector((state) => state.comments[post._id] || []);
  const countComments = (arr) =>
    arr.reduce((acc, c) => acc + 1 + countComments(c.replies || []), 0);

  const commentCount =
    comments.length > 0 ? countComments(comments) : post.commentCount || 0;

  let commentlength = commentCount;

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
          userID={currentUserId}
          reactionType={
            reactions.find((r) => r.user === currentUserId)?.type || ""
          }
          onReacted={() => setRefreshKey((k) => k + 1)}
        />
        <button
          onClick={() => setShowComments(!showComments)}
          className={cx("actionButton")}
        >
          {commentlength} 💬
        </button>
      </div>

      {/* Modal hiển thị CommentList */}
      {showComments && (
        <div
          className={cx("modalOverlay")}
          onClick={() => setShowComments(false)}
        >
          <div
            className={cx("modalContent")}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowComments(false)}
              className={cx("closeButton")}
            >
              <CircleX />
            </button>
            <CommentList
              postId={post._id}
              userID={currentUserId}
              AuthorId={post.author._id}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default PostCard;
