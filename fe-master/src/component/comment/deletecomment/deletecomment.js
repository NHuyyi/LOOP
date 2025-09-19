import { useState } from "react";
import deleteCommentAPI from "../../../services/Post/comments/deletecomment";
import classNames from "classnames/bind";
import { deleteComment } from "../../../redux/commentSlide";
import { useDispatch } from "react-redux";
import styles from "./deleteCommentButton.module.css";

const cx = classNames.bind(styles);

function DeleteCommentButton({ postId, commentId, token }) {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const dispatch = useDispatch();
  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteCommentAPI(postId, commentId, token);
    setLoading(false);
    if (result.success) {
      dispatch(deleteComment({ postId, commentId }));
      setShowConfirm(false);
    } else {
      alert(result.message);
    }
  };

  return (
    <>
      <span
        className={cx("action", "delete")}
        onClick={() => setShowConfirm(true)}
      >
        Xóa
      </span>

      {showConfirm && (
        <div className={cx("overlay")}>
          <div className={cx("confirm-dialog")}>
            <span>Bạn có chắc muốn xóa comment này?</span>
            <div className={cx("buttons")}>
              <button onClick={() => setShowConfirm(false)}>Hủy</button>
              <button onClick={handleDelete} disabled={loading}>
                {loading ? <div className={cx("spinner-border")} /> : "Xóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DeleteCommentButton;
