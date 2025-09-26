import { useState, useRef, useEffect } from "react";
import styles from "./postmenu.module.css";
import classNames from "classnames/bind";
import DeletePost from "../../post/deletepost/deletepost";
import EditPost from "../../post/editpost/editpost";
import ChangeVisibility from "../visibilityPost/visibilityPost";
import { FaCog } from "react-icons/fa";

const cx = classNames.bind(styles);

function PostMenu({ post }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(" ");
  const [fadeOut, setFadeOut] = useState(false);
  const token = localStorage.getItem("token");
  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !e.target.closest(".edit-dialog") && // không đóng khi click trong edit modal
        !e.target.closest(".confirm-dialog") && // không đóng khi click trong delete modal
        !e.target.closest(".options-dialog") // không đóng khi click trong visibility modal
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 👇 tự động xóa message sau 5s
  useEffect(() => {
    if (message) {
      // Sau 4.5s bắt đầu fade out
      const timer = setTimeout(() => {
        setFadeOut(true);
      }, 2500);

      // Sau 5s thì xóa message
      const removeTimer = setTimeout(() => {
        setMessage("");
        setFadeOut(false);
      }, 3000);

      return () => {
        clearTimeout(timer);
        clearTimeout(removeTimer);
      };
    }
  }, [message]);

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
          <div className={cx("menu-item")}>
            <EditPost
              postId={post._id}
              currentContent={post.content}
              token={token}
              setMessage={setMessage}
              setSuccess={setSuccess}
            />
          </div>

          <div className={cx("menu-item")}>
            <DeletePost postId={post._id} token={token} />
          </div>

          <div className={cx("menu-item")}>
            <ChangeVisibility
              postId={post._id}
              visibility={post.visibility}
              token={token}
            />
          </div>
        </div>
      )}
      {message && (
        <div
          className={`${cx("app-message")}  
                      ${
                        success === false
                          ? cx("app-message__err")
                          : cx("app-message__ok")
                      } ${fadeOut ? cx("fade-out") : ""}`}
        >
          {message}
        </div>
      )}
    </div>
  );
}

export default PostMenu;
