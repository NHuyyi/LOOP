import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCommentList } from "../../../services/Post/comments/getCommentList";
import { setComments } from "../../../redux/commentSlide";
import AddComment from "../addComment/addComment";
import CommentItem from "../commentItem/CommentItem";
import classNames from "classnames/bind";
import styles from "./commentList.module.css";

const cx = classNames.bind(styles);

function CommentList({ postId, userID, AuthorId }) {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const lastCommentRef = useRef(null);

  const comments = useSelector((state) =>
    Array.isArray(state.comments?.[postId]) ? state.comments[postId] : []
  );
  console.log("comment", comments);

  const [replyTarget, setReplyTaget] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await getCommentList(postId, token);
        if (res && Array.isArray(res.data)) {
          dispatch(setComments({ postId, comments: res.data }));
        }
      } catch (err) {
        console.error("fetchComments error:", err);
      }
    };
    fetchComments();
  }, [postId, token, dispatch]);

  useEffect(() => {
    if (lastCommentRef.current) {
      lastCommentRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments]);

  return (
    <div className={cx("commentWrapper")}>
      <div className={cx("scrollArea")}>
        <div className={cx("commentsContainer")}>
          {comments.length === 0 ? (
            <p className={cx("noComments")}>💬 Chưa có bình luận nào</p>
          ) : (
            comments.map((c, idx) => {
              const isLast = idx === 0;
              return (
                <div key={c._id} ref={isLast ? lastCommentRef : null}>
                  <CommentItem
                    comment={c}
                    postId={postId}
                    userID={userID}
                    AuthorId={AuthorId}
                    setReplyTaget={setReplyTaget}
                    level={0} // comment gốc = level 0
                  />
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className={cx("addCommentWrapper")}>
        <AddComment
          postId={postId}
          parentId={replyTarget?._id || null}
          replytoname={replyTarget?.name || ""}
          setReplyTaget={setReplyTaget}
        />
      </div>
    </div>
  );
}

export default CommentList;
