import { useState } from "react";
import { useSelector } from "react-redux";
import styles from "./PostCard.module.css";
import classNames from "classnames/bind";
import PostReaction from "../PostReaction/PostReaction";
import ReactionCounts from "../reactioncount/reactioncount";
import CommentList from "../../comment/commentlist/Commentlist";
import { CircleX } from "lucide-react";
import { makeSelectCommentsByPostId } from "../../../redux/selectors"; // 👈 import selector
import PostMenu from "../postmenu/postmenu";

const cx = classNames.bind(styles);

function PostCard({ post, currentUserId, friendList = [] }) {
  const [showComments, setShowComments] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // ✅ Dùng selector thay vì inline [] mới
  const comments = useSelector(makeSelectCommentsByPostId(post._id));

  // Nếu đã mở commentList thì dùng dữ liệu redux để đếm chính xác
  const countComments = (arr) =>
    arr.reduce(
      (acc, c) => acc + (c.isDeleted ? 0 : 1) + countComments(c.replies || []),
      0
    );

  const commentCount =
    comments.length > 0
      ? countComments(comments) // realtime khi đã load
      : post.commentCount || 0; // mặc định lấy từ BE

  let commentlength = commentCount;

  const updatedPost = useSelector((state) =>
    state.posts.posts.find((p) => p._id === post._id)
  );
  const currentPost = updatedPost || post;
  const reactions = currentPost.reactions || [];
  const reactionType =
    reactions.find(
      (r) =>
        r.user === currentUserId ||
        r.user?._id === currentUserId ||
        String(r.user) === String(currentUserId)
    )?.type || "";
  console.log("PostCard reactions:", reactionType);

  return (
    <div className={cx("postCard")}>
      {/* Author */}
      <div className={cx("postHeader")}>
        <div className={cx("author")}>
          <div className={cx("authorInfo")}>
            <img
              src={
                currentPost.author?.avatar ||
                "https://res.cloudinary.com/dpym64zg9/image/upload/v1755614090/raw_cq4nqn.png"
              }
              alt="avatar"
              className={cx("authorAvatar")}
            />
            <div>
              <p className={cx("authorName")}>
                {currentPost.author?.name || "ẩn danh"}
                {currentPost.isEdited && (
                  <span className={cx("editedTag")}>- đã chỉnh sửa</span>
                )}
              </p>
            </div>
          </div>
          <p className={cx("authorDate")}>
            {currentPost.isEdited && currentPost.editedAt
              ? new Date(currentPost.editedAt).toLocaleString()
              : new Date(currentPost.createdAt).toLocaleString()}{" "}
          </p>
        </div>
        {currentPost.author?._id === currentUserId && (
          <PostMenu post={currentPost} friendList={friendList} />
        )}
      </div>

      {/* Image */}
      {currentPost.imageUrl && (
        <div className={cx("postImage")}>
          <img src={currentPost.imageUrl} alt="post" />
        </div>
      )}

      {/* Content */}
      {currentPost.content && (
        <p className={cx("postContent")}>{currentPost.content}</p>
      )}

      {/* Reaction count */}
      <div className={cx("reactionCount")}>
        <ReactionCounts
          key={refreshKey}
          postId={currentPost._id}
          currentUserId={currentUserId}
          postAuthorId={currentPost.author._id}
        />
      </div>

      {/* Action bar */}
      <div className={cx("actionBar")}>
        <PostReaction
          postId={currentPost._id}
          userID={currentUserId}
          reactionType={reactionType}
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
              postId={currentPost._id}
              userID={currentUserId}
              AuthorId={currentPost.author._id}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default PostCard;
