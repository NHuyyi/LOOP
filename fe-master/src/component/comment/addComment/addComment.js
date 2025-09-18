import createComment from "../../../services/Post/comments/createComments";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setComments } from "../../../redux/commentSlide"; // 👈 đổi lại setComments
import { getCommentList } from "../../../services/Post/comments/getCommentList";
import classNames from "classnames/bind";
import styles from "./addComment.module.css";

const cx = classNames.bind(styles);

function AddComment({
  postId,
  parentId,
  replytoname,
  setReplyTaget,
  onCommentCreated,
}) {
  const editorRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const placeCaretAtEnd = (el) => {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  };

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

  useEffect(() => {
    if (!replytoname && setReplyTaget) {
      setReplyTaget(null);
    }
  }, [replytoname, setReplyTaget]);

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

      if (res && res.success) {
        // ✅ fetch lại toàn bộ comment từ BE để đồng bộ
        const res2 = await getCommentList(postId, token);
        if (res2 && Array.isArray(res2.data)) {
          dispatch(setComments({ postId, comments: res2.data }));
        }
        onCommentCreated && onCommentCreated(res.comment._id); // 👈 báo cho CommentList biết id mới
        console.log("id", res.comment._id);
      } else {
        console.warn("API createComment trả về lỗi:", res);
      }
    } catch (error) {
      console.error("createComment error:", error);
    } finally {
      setLoading(false);
      if (editorRef.current) {
        editorRef.current.innerHTML = "";
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
