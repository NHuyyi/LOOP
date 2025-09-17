import { useState } from "react";
import classNames from "classnames/bind";
import styles from "./ReactCommentSummary.module.css";
import {
  FaThumbsUp,
  FaHeart,
  FaLaugh,
  FaSurprise,
  FaSadTear,
  FaAngry,
} from "react-icons/fa";
import ReactionList from "../../post/ReactionList/ReactionList";
import { getReactCommentList } from "../../../services/Post/comments/getreactcommentlist";
const cx = classNames.bind(styles);

const reactionIcons = {
  like: <FaThumbsUp color="#1877F2" />,
  love: <FaHeart color="#F02849" />,
  haha: <FaLaugh color="#FFD93D" />,
  wow: <FaSurprise color="#2ECC71" />,
  sad: <FaSadTear color="#1C8EFB" />,
  angry: <FaAngry color="#E9710F" />,
};

function ReactCommentSummary({
  reactionCounts,
  postId,
  commentID,
  userID,
  AuthorId,
  commentuser,
}) {
  const [showPopup, setShowPopup] = useState(false);
  const [reactionList, setReactionList] = useState([]);
  const [error, setError] = useState("");
  if (!reactionCounts || Object.keys(reactionCounts).length === 0) return null;

  const topReactions = Object.entries(reactionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const total = Object.values(reactionCounts).reduce(
    (sum, val) => sum + val,
    0
  );
  const handleClick = async () => {
    if (userID !== commentuser && userID !== AuthorId) return; // ❌ không phải tác giả thì thôi
    try {
      setError("");
      const token = localStorage.getItem("token");

      const res = await getReactCommentList(postId, commentID, token);
      if (res.success) {
        setReactionList(res.data);
        setShowPopup(true);
      } else {
        setError(res.error || "Không lấy được danh sách reaction");
      }
    } catch (err) {
      setError("Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  return (
    <>
      <div
        className={cx("reaction-summary")}
        onClick={handleClick}
        style={{
          cursor:
            userID === commentuser || userID === AuthorId
              ? "pointer"
              : "default",
        }}
      >
        <div className={cx("icons")}>
          {topReactions.map(([type]) => (
            <span key={type} className={cx("icon")}>
              {reactionIcons[type]}
            </span>
          ))}
        </div>
        <span className={cx("total")}>{total}</span>
      </div>
      {showPopup && (
        <ReactionList
          reactions={reactionList}
          onClose={() => setShowPopup(false)}
          size="large" // hoặc "large"
          fontSize={16}
          iconSize={16}
        />
      )}

      {error && <p className="text-red-500">{error}</p>}
    </>
  );
}

export default ReactCommentSummary;
