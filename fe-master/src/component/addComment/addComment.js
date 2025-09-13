import createComment from "../../services/Post/comments/createComments";
import { useState } from "react";
import classNames from "classnames/bind";
import styles from "./addComment.module.css";

const cx = classNames.bind(styles);

function AddComment({ postId }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      setLoading(true);
      await createComment(postId, text, token);
    } catch (error) {
      console.error("API error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={cx("Comment-input")}>
        <input
          type="text"
          name="Comment"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={cx("custom-input")}
        />
        <button
          type="button"
          className={cx("custom-button")}
          onClick={handleClick}
        >
          {loading ? (
            <div className={cx("spinner-border text-light")}></div>
          ) : (
            "Xác nhận"
          )}
        </button>
      </div>
    </>
  );
}

export default AddComment;
