import classNames from "classnames/bind";
import styles from "./commentActions.module.css";
import ReactComment from "../reactcomment/reactcomment";
import ReactCommentSummary from "../ReacCommentSummary/ReactCommentSummary";
import dayjs from "dayjs";

const cx = classNames.bind(styles);

function CommentActions({ comment, postId, userID, AuthorId, setReplyTaget }) {
  return (
    <div className={cx("meta")}>
      <span className={cx("time")}>{dayjs(comment.createdAt).fromNow()}</span>

      <span className={cx("action")}>
        <ReactComment
          postId={postId}
          userId={userID}
          commentId={comment._id}
          reactionType={
            Array.isArray(comment.reactions)
              ? comment.reactions.find((r) => r.user === userID)?.type || ""
              : ""
          }
        />
      </span>

      <span
        className={cx("action")}
        onClick={() => {
          setReplyTaget(null);
          setTimeout(() => {
            setReplyTaget({ _id: comment._id, name: comment.name });
          }, 0);
        }}
      >
        Trả lời
      </span>

      <span className={cx("actions")}>
        <ReactCommentSummary
          reactionCounts={comment.reactionCounts}
          postId={postId}
          commentID={comment._id}
          userID={userID}
          AuthorId={AuthorId}
          commentuser={comment.userId}
        />
      </span>
    </div>
  );
}

export default CommentActions;
