import styles from "./miniprofile.module.css";
import classNames from "classnames/bind";
import MiniPost from "../minipostinprofile/minipost";
import { Copy } from "lucide-react"; // icon copy

const cx = classNames.bind(styles);

function MiniProfile({ user, post = [], setMessage, setSuccess }) {
  const mypost = post.filter((p) => p.author._id === user?._id);

  const handleCopy = () => {
    navigator.clipboard.writeText(user?.friendCode || "");
    setMessage("Đã sao chép Friend Code!");
    setSuccess(true);
  };

  return (
    <div className={cx("miniprofile")}>
      <img
        src={
          user?.avatar ||
          "https://res.cloudinary.com/dpym64zg9/image/upload/v1755614090/raw_cq4nqn.png"
        }
        alt="User Avatar"
        className={cx("avatar")}
      />

      <div className={cx("user-info")}>
        <h3 className={cx("username")}>{user?.name || "Unknown User"}</h3>
        <p className={cx("email")}>{user?.email || "No email provided"}</p>

        <div className={cx("friendcode-container")}>
          <span className={cx("friendcode")}>
            {user?.friendCode || "No friendCode"}
          </span>
          <button className={cx("copy-btn")} onClick={handleCopy}>
            <Copy size={16} color="#fff" />
          </button>
        </div>
      </div>

      <div className={cx("divider-with-text")}>
        <span>Danh sách bài viết</span>
      </div>

      <div className={cx("post-image")}>
        <MiniPost post={mypost} user={user} />
      </div>
    </div>
  );
}

export default MiniProfile;
