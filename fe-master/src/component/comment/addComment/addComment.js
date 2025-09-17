import createComment from "../../../services/Post/comments/createComments";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { addComment } from "../../../redux/commentSlide"; // 👈 đổi sang addComment
import classNames from "classnames/bind";
import styles from "./addComment.module.css";

const cx = classNames.bind(styles);

function AddComment({ postId, parentId, replytoname, setReplyTaget }) {
  const editorRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // Đặt caret cuối
  const placeCaretAtEnd = (el) => {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  };

  // Khi thay đổi reply target → chèn @Tên
  useEffect(() => {
    if (editorRef.current) {
      if (replytoname) {
        editorRef.current.innerHTML = `<span style="color:#1877F2;" contenteditable="false">@${replytoname}</span>&nbsp;`;
        placeCaretAtEnd(editorRef.current);
      } else {
        editorRef.current.innerHTML = "";
      }
    }
  }, [replytoname, parentId]);

  // Reset reply target nếu bị clear
  useEffect(() => {
    if (!replytoname && setReplyTaget) {
      setReplyTaget(null);
    }
  }, [replytoname, setReplyTaget]);

  // Lấy text từ contentEditable
  const getPlainText = () => {
    if (!editorRef.current) return "";
    return editorRef.current.innerText.trim();
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const text = getPlainText();
    if (!text) return;

    try {
      const token = localStorage.getItem("token");
      setLoading(true);

      const res = await createComment(postId, text, token, parentId);

      // BE trả về { success, comment }
      if (res && res.comment) {
        dispatch(addComment({ postId, comment: res.comment }));
      } else {
        console.warn("Phản hồi API không hợp lệ:", res);
      }
    } catch (error) {
      console.error("createComment error:", error);
    } finally {
      setLoading(false);
      if (editorRef.current) {
        if (replytoname) {
          editorRef.current.innerHTML = `<span style="color:#1877F2;" contenteditable="false">@${replytoname}</span>&nbsp;`;
          placeCaretAtEnd(editorRef.current);
        } else {
          editorRef.current.innerHTML = "";
        }
      }
      if (setReplyTaget) setReplyTaget(null);
    }
  };

  return (
    <div className={cx("Comment-input")}>
      <div
        ref={editorRef}
        contentEditable
        className={cx("editableInput")}
        suppressContentEditableWarning={true}
      ></div>
      <button
        type="button"
        className={cx("custom-button")}
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? <div className={cx("spinner-border text-light")} /> : "Gửi"}
      </button>
    </div>
  );
}

export default AddComment;
