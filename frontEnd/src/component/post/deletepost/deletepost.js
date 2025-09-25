import { useState } from "react";
import deletePost from "../../../services/Post/deletePost";
import classNames from "classnames/bind";
import { DeletePosts } from "../../../redux/postSlice";
import { useDispatch } from "react-redux";
import styles from "./deletepost.module.css";
import { FaTrashAlt } from "react-icons/fa";
import { createPortal } from "react-dom";

const cx = classNames.bind(styles);

function DeletePost({ postId, token }) {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const dispatch = useDispatch();
  const handleDelete = async () => {
    setLoading(true);
    const result = await deletePost(postId, token);
    setLoading(false);
    if (result.success) {
      dispatch(DeletePosts(postId));
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
        <FaTrashAlt /> <span> Xóa bài viết </span>
      </span>
      {showConfirm &&
        createPortal(
          <div className={cx("overlay")}>
            <div className={cx("confirm-dialog")}>
              <span>Bạn có chắc muốn xóa bài viết này?</span>
              <div className={cx("buttons")}>
                <button onClick={() => setShowConfirm(false)}>Hủy</button>
                <button onClick={handleDelete} disabled={loading}>
                  {loading ? <div className={cx("spinner-border")} /> : "Xóa"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
export default DeletePost;
