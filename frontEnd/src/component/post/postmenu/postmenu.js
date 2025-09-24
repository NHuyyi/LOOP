import { useState, useRef, useEffect } from "react";
import styles from "./postmenu.module.css";
import classNames from "classnames/bind";
import { FaCog, FaTrashAlt, FaPen, FaGlobeAmericas } from "react-icons/fa";

const cx = classNames.bind(styles);

function PostMenu({ postId }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cx("post-menu-wrapper")} ref={menuRef}>
      <button
        className={cx("menu-button")}
        onClick={() => setOpen((prev) => !prev)}
      >
        <FaCog />
      </button>

      {open && (
        <div className={cx("menu-dropdown", { show: open })}>
          <button
            className={cx("menu-item")}
            onClick={() => {
              setOpen(false);
            }}
          >
            <FaPen />
            <span> Sửa bài viết</span>
          </button>
          <button
            className={cx("menu-item")}
            onClick={() => {
              setOpen(false);
            }}
          >
            <FaTrashAlt /> <span> Xóa bài viết</span>
          </button>
          <button className={cx("menu-item")} onClick={() => setOpen(false)}>
            <FaGlobeAmericas />
            <span> Chế độ công khai</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default PostMenu;
