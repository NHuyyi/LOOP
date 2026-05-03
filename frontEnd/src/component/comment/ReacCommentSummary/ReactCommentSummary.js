import { useState } from "react";
import classNames from "classnames/bind";
import styles from "./ReactCommentSummary.module.css";
import { useReactions } from "../../../hooks/useReactions";
import ReactionList from "../../post/ReactionList/ReactionList";
import { getReactCommentList } from "../../../services/Post/comments/getreactcommentlist";
const cx = classNames.bind(styles);

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
  const { getReactionByType } = useReactions();
  if (!reactionCounts || Object.keys(reactionCounts).length === 0) return null;

  const topReactions = Object.entries(reactionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const total = Object.values(reactionCounts).reduce(
    (sum, val) => sum + val,
    0,
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
          {topReactions.map(([type]) => {
            const rInfo = getReactionByType(type);
            return rInfo ? (
              <img
                key={type}
                src={rInfo.icon}
                alt={rInfo.type}
                className={cx("icon")}
              />
            ) : null;
          })}
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
