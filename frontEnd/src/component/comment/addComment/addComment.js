import createComment from "../../../services/Post/comments/createComments";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setComments } from "../../../redux/commentSlide";
import { getCommentList } from "../../../services/Post/comments/getCommentList";
import updateComment from "../../../services/Post/comments/updatecomment";
import classNames from "classnames/bind";
import styles from "./addComment.module.css";

const cx = classNames.bind(styles);

function AddComment({
  postId,
  parentId,
  replytoname,
  editCommentId,
  initialText = "",
  setReplyTaget,
  onCommentCreated,
  onEditDone,
}) {
  const editorRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // Đặt con trỏ vào cuối nội dung
  const placeCaretAtEnd = (el) => {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  };

  // Gắn @Tên khi trả lời hoặc hiện nội dung khi chỉnh sửa
  useEffect(() => {
    if (editorRef.current) {
      if (replytoname && !editCommentId) {
        editorRef.current.innerHTML = `<a href="#" class="${cx("mention")}" contenteditable="false">@${replytoname}</a>&nbsp;`;

        placeCaretAtEnd(editorRef.current);
      } else if (editCommentId && initialText) {
        editorRef.current.innerText = initialText;
        placeCaretAtEnd(editorRef.current);
      } else {
        editorRef.current.innerHTML = "";
      }
    }
  }, [replytoname, parentId, editCommentId, initialText]);

  // Clear replyTaget nếu không còn đang reply
  useEffect(() => {
    if (!replytoname && setReplyTaget && !editCommentId) {
      setReplyTaget(null);
    }
  }, [replytoname, setReplyTaget, editCommentId]);

  // ✅ Lấy HTML nội dung thay vì plain text
  const getHtmlContent = () => {
    if (!editorRef.current) return "";
    return editorRef.current.innerHTML.trim();
  };

  // ✅ Gửi hoặc cập nhật bình luận
  const handleClick = async (e) => {
    e.preventDefault();
    const html = getHtmlContent();
    const plain = editorRef.current.innerText.trim();
    if (!plain) return; // Chặn gửi nội dung rỗng

    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      let res;

      if (editCommentId) {
        // ⚠️ Nếu bạn muốn hỗ trợ HTML khi chỉnh sửa, cần sửa cả updateComment (chưa xử lý ở đây)
        res = await updateComment(postId, editCommentId, plain, token);
      } else {
        res = await createComment(postId, html, token, parentId);
      }

      if (res && res.success) {
        const res2 = await getCommentList(postId, token);
        if (res2 && Array.isArray(res2.data)) {
          dispatch(setComments({ postId, comments: res2.data }));
        }
        if (!editCommentId) {
          onCommentCreated?.(res.comment._id);
        }
        if (editCommentId && onEditDone) {
          onEditDone();
        }
      } else {
        console.warn("API comment trả về lỗi:", res);
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
        {loading ? (
          <div className={cx("spinner-border text-light")} />
        ) : editCommentId ? (
          "Cập nhật"
        ) : (
          "Gửi"
        )}
      </button>
    </div>
  );
}

export default AddComment;
