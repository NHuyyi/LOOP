import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCommentList } from "../../../services/Post/comments/getCommentList";
import { setComments } from "../../../redux/commentSlide";
import classNames from "classnames/bind";
import styles from "./commentList.module.css";
import AddComment from "../addComment/addComment";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi"; // import ngôn ngữ tiếng Việt
import ReactComment from "../reactcomment/reactcomment";

dayjs.extend(relativeTime);
dayjs.locale("vi"); // thiết lập ngôn ngữ mặc định là tiếng Việt

const cx = classNames.bind(styles);

function CommentList({ postId, userID }) {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const lastCommentRef = useRef(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const comments = useSelector((state) =>
    Array.isArray(state.comments?.[postId]) ? state.comments[postId] : []
  );
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await getCommentList(postId, token);
        if (res && Array.isArray(res.data)) {
          dispatch(setComments({ postId, comments: res.data }));
        }
      } catch (err) {
        console.error("fetchComments error:", err);
      }
    };
    fetchComments();
  }, [postId, token, dispatch, refreshKey]);

  useEffect(() => {
    if (lastCommentRef.current) {
      lastCommentRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments]);

  const sortedComments = comments
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return (
    <div className={cx("commentWrapper")}>
      <div className={cx("scrollArea")}>
        <div className={cx("commentsContainer")}>
          {sortedComments.length === 0 ? (
            <p className={cx("noComments")}>💬 Chưa có bình luận nào</p>
          ) : (
            sortedComments.map((c, idx) => {
              const isLast = idx === 0; // vì đang sắp xếp từ mới đến cũ
              return (
                <div key={c._id} ref={isLast ? lastCommentRef : null}>
                  <div className={cx("commentItem")}>
                    <img src={c.avatar} alt={c.name} className={cx("avatar")} />
                    <div className={cx("content")}>
                      <div className={cx("bubble")}>
                        <p className={cx("name")}>{c.name}</p>
                        <p className={cx("text")}>{c.text}</p>
                      </div>
                      <div className={cx("meta")}>
                        <span className={cx("time")}>
                          {dayjs(c.createdAt).fromNow()}
                        </span>
                        <span className={cx("action")}>
                          <ReactComment
                            postId={postId}
                            userId={userID}
                            commentId={c._id}
                            reactionType={
                              Array.isArray(c.reactions)
                                ? c.reactions.find((r) => r.user === userID)
                                    ?.type || ""
                                : ""
                            }
                            onReacted={() => setRefreshKey((k) => k + 1)}
                          />
                        </span>
                        <span className={cx("action")}>Trả lời</span>
                        <span className={cx("action")}>Chia sẻ</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className={cx("addCommentWrapper")}>
        <AddComment postId={postId} />
      </div>
    </div>
  );
}

export default CommentList;
