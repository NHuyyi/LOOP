import { useEffect, useState } from "react";
import countreaction from "../../services/Post/countreaction";
import classNames from "classnames/bind";
import styles from "./reactionCounts.module.css";
import {
  FaThumbsUp,
  FaHeart,
  FaLaugh,
  FaSurprise,
  FaSadTear,
  FaAngry,
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { updateReaction } from "../../redux/reactionSlide";

const cx = classNames.bind(styles);

function ReactionCounts({ postId }) {
  const [reactionCounts, setReactionCounts] = useState({});
  const [totalReactions, setTotalReactions] = useState(0);

  const icons = {
    like: <FaThumbsUp color="#1877F2" size={16} />,
    love: <FaHeart color="#F02849" size={16} />,
    haha: <FaLaugh color="#FFD93D" size={16} />,
    wow: <FaSurprise color="#2ECC71" size={16} />,
    sad: <FaSadTear color="#1C8EFB" size={16} />,
    angry: <FaAngry color="#E9710F" size={16} />,
  };

  // redux của reaction
  const reactionData = useSelector((state) => state.reactions[postId]);
  console.log("reactionData:", reactionData);
  const dispatch = useDispatch();
  useEffect(() => {
    // Nếu redux đã có data thì set vào local state luôn
    if (reactionData) {
      setReactionCounts(reactionData.reactionCounts);
      setTotalReactions(reactionData.totalReactions);
    } else {
      // Nếu redux chưa có thì gọi API lần đầu
      const fetchCounts = async () => {
        const res = await countreaction(postId);
        if (res.success) {
          dispatch(
            updateReaction({
              postId,
              reactionCounts: res.data.reactionCounts,
              totalReactions: res.data.totalReactions,
            })
          );
        } else {
          console.error("Lỗi khi đếm reaction:", res.message);
        }
      };
      fetchCounts();
    }
  }, [reactionData, postId, dispatch]);

  const topReactions = Object.entries(reactionCounts)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className={cx("summary")}>
      <div className={cx("icons")}>
        {topReactions.map(([type]) => (
          <span key={type} className={cx("icon")}>
            {icons[type]}
          </span>
        ))}
      </div>
      <span className={cx("total")}>{formatNumber(totalReactions)}</span>
    </div>
  );
}

function formatNumber(num) {
  if (num >= 1000000)
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return num.toString();
}

export default ReactionCounts;
