import createComment from "../../../services/Post/comments/createComments";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setComments, addComment } from "../../../redux/commentSlide";
import classNames from "classnames/bind";
import styles from "./addComment.module.css";

const cx = classNames.bind(styles);

function AddComment({ postId }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleClick = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const token = localStorage.getItem("token");
      setLoading(true);
      const res = await createComment(postId, text, token);

      // FE xử lý nhiều kiểu response: comments array (toàn bộ), hoặc single comment
      if (res) {
        if (Array.isArray(res.comments)) {
          dispatch(setComments({ postId, comments: res.comments }));
        } else if (res.comment) {
          dispatch(addComment({ postId, comment: res.comment }));
        } else if (Array.isArray(res.data)) {
          dispatch(setComments({ postId, comments: res.data }));
        } else {
          // fallback: tạo object local tạm (nếu BE không trả đầy đủ)
          const tempComment = {
            userId: "me",
            name: "Bạn",
            avatar: null,
            text,
            createdAt: new Date().toISOString(),
          };
          dispatch(addComment({ postId, comment: tempComment }));
        }
      }
    } catch (error) {
      console.error("createComment error:", error);
    } finally {
      setLoading(false);
      setText("");
    }
  };

  return (
    <div className={cx("Comment-input")}>
      <input
        type="text"
        name="Comment"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className={cx("custom-input")}
        placeholder="Viết bình luận..."
      />
      <button
        type="button"
        className={cx("custom-button")}
        onClick={handleClick}
        disabled={loading || !text.trim()}
      >
        {loading ? <div className={cx("spinner-border text-light")} /> : "Gửi"}
      </button>
    </div>
  );
}

export default AddComment;
