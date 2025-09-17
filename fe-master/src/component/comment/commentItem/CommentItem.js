import classNames from "classnames/bind";
import styles from "./commentItem.module.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import CommentActions from "../commentActions/commentActions";

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
}) {
  return (
    <div
      className={cx("commentWrapper")}
      style={{ marginLeft: `${level * 20}px` }}
    >
      <div className={cx("commentItem")}>
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

          {comment.replies?.length > 0 && (
            <div className={cx("replies")}>
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply._id}
                  comment={reply}
                  postId={postId}
                  userID={userID}
                  AuthorId={AuthorId}
                  setReplyTaget={setReplyTaget}
                  level={level + 1} // thụt lề thêm
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CommentItem;
