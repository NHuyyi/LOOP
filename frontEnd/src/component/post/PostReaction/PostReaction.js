import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames/bind";
import styles from "./PostReaction.module.css";
import addreaction from "../../../services/Post/reaction/addreaction";

import { FaStar } from "react-icons/fa";

import { useReactions } from "../../../hooks/useReactions";

const cx = classNames.bind(styles);

function PostReaction({ postId, userID, onReacted }) {
  const [showMenu, setShowMenu] = useState(false);
  const closeTimer = useRef(null);
  const { reactions, getReactionByType } = useReactions();

  // ✅ Lấy post từ Redux --> tự động re-render khi Redux update
  const post = useSelector((state) =>
    state.posts?.posts?.find((p) => p._id === postId),
  );

  // ✅ Lấy reaction hiện tại của user trên post này
  const currentReaction =
    post?.reactions?.find((r) => r.user === userID)?.type || null;

  // ✅ Không lưu reaction trong local state -> Redux upd là UI tự đổi
  const handleReaction = async (type) => {
    if (!userID) return alert("Vui lòng đăng nhập để thực hiện phản ứng.");

    try {
      const res = await addreaction(postId, userID, type);

      if (res.success) {
        setShowMenu(false);
        onReacted?.(); // socket sẽ update redux
      } else {
        alert(res?.message || "Có lỗi khi thực hiện.");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi mạng, vui lòng thử lại.");
    }
  };

  const handleMainClick = () => {
    if (!currentReaction) handleReaction("like");
    else handleReaction(currentReaction);
  };

  const handleMouseEnter = () => {
    clearTimeout(closeTimer.current);
    setShowMenu(true);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setShowMenu(false), 400);
  };

  const currentObj = currentReaction
    ? getReactionByType(currentReaction)
    : null;

  return (
    <div
      className={cx("reaction-wrapper")}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Nút chính */}
      <button
        className={cx("main-button")}
        style={{ color: currentObj ? currentObj.color : "gray" }}
        onClick={handleMainClick}
      >
        {currentObj ? (
          <img
            src={currentObj.icon}
            alt={currentObj.type}
            style={{ width: "32px", height: "32px", objectFit: "contain" }}
            translate="scale(1.4)"
          />
        ) : (
          <FaStar size={25} />
        )}
        <span style={{ color: "gray" }}>
          {currentObj?.type
            ? currentObj.type.charAt(0).toUpperCase() + currentObj.type.slice(1)
            : "Like"}
        </span>
      </button>

      {/* Menu lựa chọn reaction */}
      {showMenu && (
        <div className={cx("reaction-menu")}>
          {reactions.map((r) => (
            <button
              key={r.type}
              className={cx("reaction-item", {
                active: currentReaction === r.type,
              })}
              onClick={() => handleReaction(r.type)}
              title={r.type}
            >
              <img
                src={r.icon}
                alt={r.type}
                style={{ width: "42px", height: "42px", objectFit: "contain" }}
                translate="scale(1.4)"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default PostReaction;
