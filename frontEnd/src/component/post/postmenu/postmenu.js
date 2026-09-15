import { useState, useRef, useEffect } from "react";
import styles from "./postmenu.module.css";
import classNames from "classnames/bind";
import DeletePost from "../../post/deletepost/deletepost";
import EditPost from "../../post/editpost/editpost";
import ChangeVisibility from "../visibilityPost/visibilityPost";
import { FaCog } from "react-icons/fa";

const cx = classNames.bind(styles);

function PostMenu({ post, friendList = [] }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();
  const token = localStorage.getItem("token");
  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !e.target.closest(".edit-dialog") && // không đóng khi click trong edit modal
        !e.target.closest(".confirm-dialog") && // không đóng khi click trong delete modal
        !e.target.closest(".options-dialog") && // không đóng khi click trong visibility modal
        !e.target.closest(".custom-visibility-modal") // không đóng khi click trong visibility custom modal
      ) {
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
          <div className={cx("menu-item")}>
            <EditPost
              postId={post._id}
              currentContent={post.content}
              token={token}
            />
          </div>

          <div className={cx("menu-item")}>
            <DeletePost postId={post._id} token={token} />
          </div>

          <div className={cx("menu-item")}>
            <ChangeVisibility
              postId={post._id}
              visibility={post.visibility}
              denyList={post.denyList || []}
              friendList={friendList}
              token={token}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default PostMenu;
