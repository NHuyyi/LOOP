import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames/bind";
import styles from "./PostReaction.module.css";
import addreaction from "../../../services/Post/reaction/addreaction";

import {
  FaThumbsUp,
  FaHeart,
  FaLaugh,
  FaSurprise,
  FaSadTear,
  FaAngry,
} from "react-icons/fa";

const cx = classNames.bind(styles);

function PostReaction({ postId, userID, onReacted }) {
  const [showMenu, setShowMenu] = useState(false);
  const closeTimer = useRef(null);

  // ✅ Lấy post từ Redux --> tự động re-render khi Redux update
  const post = useSelector((state) =>
    state.posts?.posts?.find((p) => p._id === postId)
  );

  // ✅ Lấy reaction hiện tại của user trên post này
  const currentReaction =
    post?.reactions?.find((r) => r.user === userID)?.type || null;

  const reactions = [
    {
      type: "like",
      icon: <FaThumbsUp color="#1877F2" size={25} />,
      label: "Like",
      color: "#1877F2",
    },
    {
      type: "love",
      icon: <FaHeart color="#F02849" size={25} />,
      label: "Love",
      color: "#F02849",
    },
    {
      type: "haha",
      icon: <FaLaugh color="#FFD93D" size={25} />,
      label: "Haha",
      color: "#FFD93D",
    },
    {
      type: "wow",
      icon: <FaSurprise color="#2ECC71" size={25} />,
      label: "Wow",
      color: "#2ECC71",
    },
    {
      type: "sad",
      icon: <FaSadTear color="#1C8EFB" size={25} />,
      label: "Sad",
      color: "#1C8EFB",
    },
    {
      type: "angry",
      icon: <FaAngry color="#E9710F" size={25} />,
      label: "Angry",
      color: "#E9710F",
    },
  ];

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
    ? reactions.find((r) => r.type === currentReaction)
    : { label: "Like", icon: <FaThumbsUp size={25} />, color: "gray" };

  return (
    <div
      className={cx("reaction-wrapper")}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Nút chính */}
      <button
        className={cx("main-button")}
        style={{ color: currentObj.color }}
        onClick={handleMainClick}
      >
        {currentObj.icon}
        <span style={{ color: currentObj.color }}>{currentObj.label}</span>
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
              title={r.label}
            >
              {r.icon}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default PostReaction;
