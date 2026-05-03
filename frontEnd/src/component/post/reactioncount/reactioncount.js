import { useState } from "react";
import classNames from "classnames/bind";
import styles from "./reactionCounts.module.css";
import { useReactions } from "../../../hooks/useReactions";
import { useSelector } from "react-redux";
import { getReactionList } from "../../../services/Post/reaction/getReactionList";
import ReactionList from "../ReactionList/ReactionList";

const cx = classNames.bind(styles);

function ReactionCounts({ postId, postAuthorId, currentUserId }) {
  const reactionData = useSelector((state) => state.reactions[postId]);
  const [showPopup, setShowPopup] = useState(false);
  const [reactionList, setReactionList] = useState([]);
  const [error, setError] = useState("");

  const { getReactionByType } = useReactions();

  if (!reactionData) return null;

  const topReactions = Object.entries(reactionData.reactionCounts || {})
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const handleClick = async () => {
    if (currentUserId !== postAuthorId) return; // ❌ không phải tác giả thì thôi
    try {
      setError("");
      const token = localStorage.getItem("token");

      const res = await getReactionList(postId, token);
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
        className={cx("summary")}
        onClick={handleClick}
        style={{
          cursor: currentUserId === postAuthorId ? "pointer" : "default",
        }}
      >
        <span className={cx("total")}>
          {formatNumber(reactionData.totalReactions)}
        </span>
        <div className={cx("icons")}>
          {topReactions.map(([type]) => {
            const rInfo = getReactionByType(type);
            return <img src={rInfo.icon} alt={type} className={cx("icon")} />;
          })}
        </div>
      </div>

      {showPopup && (
        <ReactionList
          reactions={reactionList}
          onClose={() => setShowPopup(false)}
        />
      )}

      {error && <p className="text-red-500">{error}</p>}
    </>
  );
}

function formatNumber(num) {
  if (num >= 1000000)
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  if (num === 0) return "";
  return num.toString();
}

export default ReactionCounts;
