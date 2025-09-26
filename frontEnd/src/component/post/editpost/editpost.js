import { useState } from "react";
import editPost from "../../../services/Post/editpost";
import classNames from "classnames/bind";
import { updatePost } from "../../../redux/postSlice";
import { useDispatch } from "react-redux";
import styles from "./editpost.module.css";
import { FaEdit } from "react-icons/fa";
import { createPortal } from "react-dom";

const cx = classNames.bind(styles);

function EditPost({ postId, currentContent, token, setMessage, setSuccess }) {
  const [loading, setLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [newContent, setNewContent] = useState(currentContent);
  const dispatch = useDispatch();

  const handleEdit = async () => {
    if (newContent.trim() === "") {
      setMessage("Nội dung không được để trống");
      setSuccess(false);
      return;
    }
    setLoading(true);
    const result = await editPost(postId, newContent, token);
    setLoading(false);
    if (result.success) {
      dispatch(updatePost(result.post));
      setShowEdit(false);
      setMessage("Cập nhật bài viết thành công");
      setSuccess(true);
    } else {
      setMessage(result.message);
      setSuccess(false);
    }
  };
  return (
    <>
      <span className={cx("action", "edit")} onClick={() => setShowEdit(true)}>
        <FaEdit /> <span> Sửa bài viết </span>
      </span>
      {showEdit &&
        createPortal(
          <div
            className={cx("overlay")} // bấm nền để đóng
          >
            <div
              className={`${cx("edit-dialog")} edit-dialog`}
              onClick={(e) => {
                console.log("clicked inside dialog");
                e.stopPropagation();
              }} // chặn lan truyền
            >
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className={cx("textarea")}
                rows={4}
              />
              <div className={cx("buttons")}>
                <button onClick={() => setShowEdit(false)}>Hủy</button>
                <button onClick={handleEdit} disabled={loading}>
                  {loading ? <div className={cx("spinner-border")} /> : "Lưu"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
export default EditPost;
