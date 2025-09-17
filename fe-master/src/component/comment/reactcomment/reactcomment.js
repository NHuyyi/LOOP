import { useState, useRef, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./ReactComment.module.css";
import reactComment from "../../../services/Post/comments/reactcomment";
import {
  FaThumbsUp,
  FaHeart,
  FaLaugh,
  FaSurprise,
  FaSadTear,
  FaAngry,
} from "react-icons/fa";

const cx = classNames.bind(styles);

function ReactComment({
  postId,
  userId,
  commentId,
  reactionType: initialReaction,
}) {
  const [currentReaction, setCurrentReaction] = useState(
    initialReaction || null
  );
  useEffect(() => {
    setCurrentReaction(initialReaction || null);
  }, [initialReaction]);
  const [showMenu, setShowMenu] = useState(false);
  // ref để lưu timer đóng menu
  const closeTimer = useRef(null);

  const reactions = [
    {
      type: "like",
      icon: <FaThumbsUp color="#1877F2" />,
      color: "#1877F2",
    },
    {
      type: "love",
      icon: <FaHeart color="#F02849" />,
      color: "#F02849",
    },
    {
      type: "haha",
      icon: <FaLaugh color="#FFD93D" />,
      color: "#FFD93D",
    },
    {
      type: "wow",
      icon: <FaSurprise color="#2ECC71" />,
      color: "#2ECC71",
    },
    {
      type: "sad",
      icon: <FaSadTear color="#1C8EFB" />,
      color: "#1C8EFB",
    },
    {
      type: "angry",
      icon: <FaAngry color="#E9710F" />,
      color: "#E9710F",
    },
  ];

  const handleReaction = async (type) => {
    if (!userId) {
      alert("Vui lòng đăng nhập để thực hiện phản ứng.");
      return;
    }

    try {
      const res = await reactComment(postId, userId, commentId, type);

      if (res.success) {
        // nếu user vừa bấm lại cùng loại reaction => xóa
        if (currentReaction === type) {
          setCurrentReaction(null);
        } else {
          setCurrentReaction(type);
        }
        setShowMenu(false);
      } else {
        alert(res.message || "Thêm phản ứng thất bại, vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi thêm reaction:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  const handleMouseEnter = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setShowMenu(true);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => {
      setShowMenu(false);
    }, 400); // delay 0.4s trước khi đóng
  };

  let currentReactionObj;

  if (!currentReaction) {
    currentReactionObj = {
      type: "none",
      icon: <FaLaugh />,
    };
  } else {
    currentReactionObj = reactions.find((r) => r.type === currentReaction);
  }

  const handleMainClick = () => {
    // Nếu chưa có reaction thì mặc định là "haha"
    if (!currentReaction) {
      handleReaction("haha");
    } else {
      // Nếu đã có reaction thì click lại vào nút chính => toggle (xoá reaction)
      handleReaction(currentReaction);
    }
  };
  return (
    <div
      className={cx("reaction-wrapper")}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Nút chính */}
      <button
        className={cx("main-button")}
        style={{ color: currentReactionObj.color }}
        onClick={handleMainClick}
      >
        {currentReactionObj.icon}
      </button>

      {/* Menu reactions */}
      {showMenu && (
        <div className={cx("reaction-menu")}>
          {reactions.map((reaction) => (
            <button
              key={reaction.type}
              className={cx("reaction-item", {
                active: currentReaction === reaction.type,
              })}
              onClick={() => handleReaction(reaction.type)}
              title={reaction.label}
            >
              {reaction.icon}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReactComment;
