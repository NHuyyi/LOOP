import classNames from "classnames/bind";
import styles from "./commentItem.module.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import CommentActions from "../commentActions/commentActions";
import { useState } from "react";

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
}) {
  const [showReplies, setShowReplies] = useState(false);

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
        <img src={comment.avatar} alt={comment.name} className={cx("avatar")} />
        <div className={cx("content")}>
          <div className={cx("bubble")}>
            <p className={cx("name")}>{comment.name}</p>
            <p className={cx("text")}>{comment.text}</p>
          </div>

          <CommentActions
            comment={comment}
            postId={postId}
            userID={userID}
            AuthorId={AuthorId}
            setReplyTaget={setReplyTaget}
          />

          {/* Hiển thị nút mở replies nếu có */}
          {comment.replies?.length > 0 && !showReplies && (
            <button
              className={cx("replyToggle")}
              onClick={() => setShowReplies(true)}
            >
              {comment.replies.length} phản hồi
            </button>
          )}
        </div>
      </div>

      {/* Hiển thị replies nếu đã mở */}
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
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CommentItem;
