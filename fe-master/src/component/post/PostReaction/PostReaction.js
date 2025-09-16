import { useState, useRef } from "react";
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

function PostReaction({
  postId,
  userID,
  reactionType: initialReaction,
  onReacted,
}) {
  const [currentReaction, setCurrentReaction] = useState(
    initialReaction || null
  );
  const [showMenu, setShowMenu] = useState(false);

  // ref để lưu timer đóng menu
  const closeTimer = useRef(null);

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

  const handleReaction = async (type) => {
    if (!userID) {
      alert("Vui lòng đăng nhập để thực hiện phản ứng.");
      return;
    }

    try {
      const res = await addreaction(postId, userID, type);

      if (res.success) {
        // nếu user vừa bấm lại cùng loại reaction => xóa
        if (currentReaction === type) {
          setCurrentReaction(null);
        } else {
          setCurrentReaction(type);
        }
        setShowMenu(false);
        onReacted?.();
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
      icon: <FaThumbsUp className="text-gray" size={25} />,
      label: "Like",
      color: "gray",
    };
  } else {
    currentReactionObj = reactions.find((r) => r.type === currentReaction);
  }

  const handleMainClick = () => {
    // Nếu chưa có reaction thì mặc định là "like"
    if (!currentReaction) {
      handleReaction("like");
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
        <span style={{ color: currentReactionObj.color }}>
          {currentReactionObj.label}
        </span>
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

export default PostReaction;
