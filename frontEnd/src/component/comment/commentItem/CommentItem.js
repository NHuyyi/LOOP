import { useState, useRef, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./commentItem.module.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import CommentActions from "../commentActions/commentActions";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import HoverProfileCard from "../../user/HoverProfileCard/HoverProfileCard";

dayjs.extend(relativeTime);
dayjs.locale("vi");

const cx = classNames.bind(styles);

function CommentItem({
  comment,
  postId,
  userID,
  AuthorId,
  setReplyTaget,
  level = 0,
  newestCommentId,
  lastCommentRef,
  setEditTarget,
  token,
  onDeleted,
}) {
  const [showReplies, setShowReplies] = useState(false);
  const [hoveredMention, setHoveredMention] = useState(null);
  const navigate = useNavigate();
  let hoverTimeout = useRef(null);

  useEffect(() => {
    if (comment.replies?.some((r) => r._id === newestCommentId)) {
      setShowReplies(true);
    }
  }, [comment.replies, newestCommentId]);

  useEffect(() => {
    if (comment._id === newestCommentId && lastCommentRef?.current) {
      lastCommentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [comment._id, newestCommentId, lastCommentRef]);

  const handleMouseOver = (e) => {
    const mentionEl = e.target.closest("a.mention"); // Kiểm tra xem chuột có nằm trên thẻ tag không

    if (mentionEl) {
      clearTimeout(hoverTimeout.current);
      const rect = mentionEl.getBoundingClientRect();
      setHoveredMention({
        id: mentionEl.getAttribute("data-id"),
        name: mentionEl.getAttribute("data-name"),
        avatar: mentionEl.getAttribute("data-avatar"),
        position: { x: rect.left, y: rect.top },
      });
    }
  };

  const handleMouseOut = (e) => {
    const mentionEl = e.target.closest("a.mention");
    if (mentionEl) {
      hoverTimeout.current = setTimeout(() => {
        setHoveredMention(null);
      }, 300); // Delay 300ms để người dùng kịp di chuyển chuột lên card
    }
  };

  // Xử lý click trực tiếp vào chữ màu xanh
  const handleClick = (e) => {
    const mentionEl = e.target.closest("a.mention");
    if (mentionEl) {
      e.preventDefault(); // Ngăn hành vi mở link mặc định
      const userId = mentionEl.getAttribute("data-id");
      if (userId) navigate(`/friend/${userId}`);
    }
  };
  return (
    <div
      className={cx("commentWrapper")}
      ref={comment._id === newestCommentId ? lastCommentRef : null}
    >
      <div
        className={cx("commentItem")}
        style={{
          marginLeft: `${Math.min(level, 2) * 4}rem`,
          paddingLeft: Math.min(level, 2) > 0 ? "12px" : "0",
        }}
      >
        <img
          src={comment.avatar}
          alt={comment.name}
          className={cx("avatar", { deleted: comment.isDeleted })}
        />
        <div className={cx("content")}>
          <div className={cx("bubble", { deleted: comment.isDeleted })}>
            {!comment.isDeleted ? (
              <>
                <p className={cx("name")}>
                  {comment.name}
                  {comment.isEdited && (
                    <span className={cx("editedTag")}>· đã chỉnh sửa</span>
                  )}
                </p>

                {/* ✅ Render nội dung HTML ở đây */}
                <div
                  className={cx("text")}
                  dangerouslySetInnerHTML={{ __html: comment.text }}
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                  onClick={handleClick}
                ></div>
              </>
            ) : (
              <p className={cx("deletedText")}>Bình luận đã bị xóa</p>
            )}
          </div>

          <CommentActions
            comment={comment}
            postId={postId}
            userID={userID}
            AuthorId={AuthorId}
            setReplyTaget={setReplyTaget}
            setEditTarget={setEditTarget}
            token={token}
            onDeleted={onDeleted}
          />

          {comment.replies?.some((r) => !r.isDeleted) && !showReplies && (
            <button
              className={cx("replyToggle")}
              onClick={() => setShowReplies(true)}
            >
              {comment.replies.filter((r) => !r.isDeleted).length} phản hồi
            </button>
          )}
        </div>
      </div>

      {showReplies && comment.replies?.length > 0 && (
        <div className={cx("replies")}>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              postId={postId}
              userID={userID}
              AuthorId={AuthorId}
              setReplyTaget={setReplyTaget}
              level={level + 1}
              newestCommentId={newestCommentId}
              lastCommentRef={lastCommentRef}
              token={token}
              onDeleted={onDeleted}
            />
          ))}
        </div>
      )}

      {hoveredMention &&
        createPortal(
          <HoverProfileCard
            userData={hoveredMention}
            position={hoveredMention.position}
            onMouseEnter={() => clearTimeout(hoverTimeout.current)}
            onMouseLeave={() => setHoveredMention(null)}
          />,
          document.body,
        )}
    </div>
  );
}

export default CommentItem;
