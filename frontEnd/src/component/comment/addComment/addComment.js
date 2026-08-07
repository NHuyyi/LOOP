import { useState, useEffect, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames/bind";
import Tribute from "tributejs";
import "tributejs/dist/tribute.css"; // CSS hiển thị dropdown mặc định cực đẹp của Tribute

import createComment from "../../../services/Post/comments/createComments";
import { setComments } from "../../../redux/commentSlide";
import { getCommentList } from "../../../services/Post/comments/getCommentList";
import updateComment from "../../../services/Post/comments/updatecomment";
import styles from "./addComment.module.css";
import Loading from "../../Loading/Loading";

const cx = classNames.bind(styles);

function AddComment({
  postId,
  parentId,
  replytoname,
  replyToUserId,
  replyToAvatar,
  editCommentId,
  initialText = "",
  setReplyTaget,
  onCommentCreated,
  onEditDone,
}) {
  const editorRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // Lấy dữ liệu bạn bè từ Redux và bọc bằng useMemo để sửa warning ESLint
  const friendsRaw = useSelector((state) => state.friend.friends);
  const friends = useMemo(() => friendsRaw || [], [friendsRaw]);
  // Dùng Ref để lưu data bạn bè mới nhất cho TributeJS (tránh khởi tạo lại nhiều lần)
  const tributeDataRef = useRef([]);
  useEffect(() => {
    tributeDataRef.current = friends
      .filter((friend) => friend && friend._id)
      .map((friend) => ({
        key: String(friend.name || ""),
        value: String(friend.name || ""),
        id: friend._id,
        avatar: friend.avatar || "/default-avatar.png",
      }));
  }, [friends]);

  // Đặt con trỏ vào cuối nội dung
  const placeCaretAtEnd = (el) => {
    if (!el) return;
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  };

  // 2. KHỞI TẠO TRIBUTEJS (Dropdown Tag User) CHỈ 1 LẦN
  useEffect(() => {
    const editorNode = editorRef.current;
    if (!editorNode) {
      return;
    }

    // Tránh lỗi 'Tribute was already bound' khi React StrictMode mount/unmount
    if (editorNode.getAttribute("data-tribute")) {
      editorNode.removeAttribute("data-tribute");
    }

    const tribute = new Tribute({
      trigger: "@",
      requireLeadingSpace: false, 
      // Lấy danh sách bạn bè động từ Ref và TỰ ĐỘNG LỌC theo text
      values: function (text, cb) {
        const allFriends = tributeDataRef.current;
        if (!text) {
          cb(allFriends);
        } else {
          // Lọc danh sách bạn bè theo tên người dùng đang gõ
          const filtered = allFriends.filter((item) =>
            item.value.toLowerCase().includes(text.toLowerCase())
          );
          cb(filtered);
        }
      },
      // Giao diện hiển thị menu dropdown nhỏ gọn
      menuItemTemplate: function (item) {
        return `<div style="display: flex; align-items: center; gap: 8px; padding: 4px;">
                  <img src="${item.original.avatar}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover;" />
                  <span style="font-size: 14px; font-weight: 500; color: #1c1e21;">${item.original.value}</span>
                </div>`;
      },
      // Khi click vào 1 người, nó sẽ chèn thẻ a y hệt logic nút Trả lời của bạn
      selectTemplate: function (item) {
        if (typeof item === "undefined") return null;
        return `<a href="/friend/${item.original.id}" class="mention" data-id="${item.original.id}" data-name="${item.original.value}" data-avatar="${item.original.avatar}" contenteditable="false">@${item.original.value}</a>`;
      },
      noMatchTemplate: function () {
        return '<span style="display: none;"></span>';
      },
      allowSpaces: true, // Cho phép gõ khoảng trắng khi tìm kiếm
    });

    // Gắn dropdown vào khung nhập liệu
    try {
      tribute.attach(editorNode);
    } catch (err) {
      console.error("Tribute Debug: Lỗi khi gắn TributeJS:", err);
    }

    return () => {
      try {
        tribute.detach(editorNode);
        editorNode.removeAttribute("data-tribute"); // Gỡ bỏ cờ để có thể mount lại
      } catch (e) { }
    };
  }, []); // 🚀 Để rỗng [] để Tribute chỉ gắn 1 lần duy nhất, không gây lỗi bound


  // 3. Gắn nội dung ban đầu (Reply hoặc Edit)
  useEffect(() => {
    const editorNode = editorRef.current;
    if (editorNode) {
      if (replytoname && !editCommentId) {
        editorNode.innerHTML = `<a href="/friend/${replyToUserId}" class="mention" data-id="${replyToUserId}" data-name="${replytoname}" data-avatar="${replyToAvatar}" contenteditable="false">@${replytoname}</a>&nbsp;`;
        placeCaretAtEnd(editorNode);
      } else if (editCommentId && initialText) {
        editorNode.innerHTML = initialText;
        placeCaretAtEnd(editorNode);
      } else {
        editorNode.innerHTML = "";
      }
    }
  }, [replytoname, parentId, editCommentId, initialText, replyToUserId, replyToAvatar]);

  // Clear replyTaget
  useEffect(() => {
    if (!replytoname && setReplyTaget && !editCommentId) {
      setReplyTaget(null);
    }
  }, [replytoname, setReplyTaget, editCommentId]);

  const getHtmlContent = () => {
    if (!editorRef.current) return "";
    return editorRef.current.innerHTML.trim();
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const html = getHtmlContent();
    const plain = editorRef.current.innerText.trim();
    if (!plain) return;

    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      let res;
      if (editCommentId) {
        res = await updateComment(postId, editCommentId, html, token);
      } else {
        res = await createComment(postId, html, token, parentId);
      }

      if (res && res.success) {
        const res2 = await getCommentList(postId, token);
        if (res2 && Array.isArray(res2.data)) {
          dispatch(setComments({ postId, comments: res2.data }));
        }
        if (!editCommentId) onCommentCreated?.(res.comment._id);
        if (editCommentId && onEditDone) onEditDone();
      }
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setLoading(false);
      if (editorRef.current) editorRef.current.innerHTML = "";
      if (setReplyTaget) setReplyTaget(null);
    }
  };

  return (
    <div className={cx("Comment-input")}>
      {/* TRỞ VỀ DÙNG CONTENTEDITABLE NHƯ CŨ */}
      <div
        ref={editorRef}
        contentEditable
        className={cx("editableInput")}
        suppressContentEditableWarning={true}
        placeholder="Viết bình luận..."
      ></div>

      <button
        type="button"
        className={cx("custom-button")}
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? <Loading size="small" /> : editCommentId ? "Cập nhật" : "Gửi"}
      </button>
    </div>
  );
}

export default AddComment;
