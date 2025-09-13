import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCommentList } from "../../services/Post/comments/getCommentList";
import { setComments } from "../../redux/commentSlide";
import classNames from "classnames/bind";
import styles from "./commentList.module.css";
import AddComment from "../addComment/addComment";
const cx = classNames.bind(styles);

function CommentList({ postId }) {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  // lấy từ redux, nếu chưa có -> []
  const comments = useSelector((state) =>
    Array.isArray(state.comments?.[postId]) ? state.comments[postId] : []
  );

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

  return (
    <div className={cx("commentsContainer")}>
      {comments.length === 0 ? (
        <p className={cx("noComments")}>💬 Chưa có bình luận nào</p>
      ) : (
        comments.map((c, idx) => (
          <div key={idx} className={cx("commentItem")}>
            <img src={c.avatar} alt={c.name} className={cx("avatar")} />
            <div className={cx("bubble")}>
              <p className={cx("name")}>{c.name}</p>
              <p className={cx("text")}>{c.text}</p>
            </div>
          </div>
        ))
      )}

      <div className={cx("addCommentWrapper")}>
        <AddComment postId={postId} />
      </div>
    </div>
  );
}

export default CommentList;
