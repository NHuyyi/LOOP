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

  const [replyTarget, setReplyTaget] = useState(null);
  const [newestCommentId, setNewestCommentId] = useState(null);
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
      lastCommentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [newestCommentId]);

  return (
    <div className={cx("commentWrapper")}>
      <div className={cx("scrollArea")}>
        <div className={cx("commentsContainer")}>
          {comments.length === 0 ? (
            <p className={cx("noComments")}>💬 Chưa có bình luận nào</p>
          ) : (
            comments.map((c) => {
              return (
                <div
                  key={c._id}
                  ref={c._id === newestCommentId ? lastCommentRef : null}
                >
                  <CommentItem
                    comment={c}
                    postId={postId}
                    userID={userID}
                    AuthorId={AuthorId}
                    setReplyTaget={setReplyTaget}
                    level={0} // comment gốc = level 0
                    newestCommentId={newestCommentId} // 👈 truyền xuống
                    lastCommentRef={lastCommentRef} // 👈 truyền ref
                    token={token}
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
          onCommentCreated={(id) => setNewestCommentId(id)} // 👈 callback khi tạo comment xong
        />
      </div>
    </div>
  );
}

export default CommentList;
