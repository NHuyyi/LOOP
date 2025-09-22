import classNames from "classnames/bind";
import styles from "./commentItem.module.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import CommentActions from "../commentActions/commentActions";
import { useState, useEffect } from "react";

dayjs.extend(relativeTime);
dayjs.locale("vi");

const cx = classNames.bind(styles);

function CommentItem({
  comment,
  postId,
  userID,
  AuthorId,
  setReplyTaget,
  level = 0,
  newestCommentId,
  lastCommentRef,
  setEditTarget,
  token,
  onDeleted,
}) {
  const [showReplies, setShowReplies] = useState(false);

  useEffect(() => {
    if (comment.replies?.some((r) => r._id === newestCommentId)) {
      setShowReplies(true);
    }
  }, [comment.replies, newestCommentId]);

  useEffect(() => {
    if (comment._id === newestCommentId && lastCommentRef?.current) {
      lastCommentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [comment._id, newestCommentId, lastCommentRef]);

  return (
    <div
      className={cx("commentWrapper")}
      ref={comment._id === newestCommentId ? lastCommentRef : null}
    >
      <div
        className={cx("commentItem")}
        style={{
          marginLeft: `${Math.min(level, 2) * 4}rem`,
          paddingLeft: Math.min(level, 2) > 0 ? "12px" : "0",
        }}
      >
        <img
          src={comment.avatar}
          alt={comment.name}
          className={cx("avatar", { deleted: comment.isDeleted })}
        />
        <div className={cx("content")}>
          <div className={cx("bubble", { deleted: comment.isDeleted })}>
            {!comment.isDeleted ? (
              <>
                <p className={cx("name")}>{comment.name}</p>
                <p className={cx("text")}>{comment.text}</p>
              </>
            ) : (
              <p className={cx("deletedText")}>Bình luận đã bị xóa</p>
            )}
          </div>

          <CommentActions
            comment={comment}
            postId={postId}
            userID={userID}
            AuthorId={AuthorId}
            setReplyTaget={setReplyTaget}
            setEditTarget={setEditTarget}
            token={token}
            onDeleted={onDeleted}
          />

          {comment.replies?.some((r) => !r.isDeleted) && !showReplies && (
            <button
              className={cx("replyToggle")}
              onClick={() => setShowReplies(true)}
            >
              {comment.replies.filter((r) => !r.isDeleted).length} phản hồi
            </button>
          )}
        </div>
      </div>

      {showReplies && comment.replies?.length > 0 && (
        <div className={cx("replies")}>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              postId={postId}
              userID={userID}
              AuthorId={AuthorId}
              setReplyTaget={setReplyTaget}
              level={level + 1}
              newestCommentId={newestCommentId}
              lastCommentRef={lastCommentRef}
              token={token}
              onDeleted={onDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CommentItem;
