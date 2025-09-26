import { useState, useEffect } from "react";
import changePostVisibility from "../../../services/Post/postvisibility";
import classNames from "classnames/bind";
import { updatePost } from "../../../redux/postSlice";
import { useDispatch } from "react-redux";
import styles from "./changevisibility.module.css";
import { FaGlobeAmericas } from "react-icons/fa";
import { createPortal } from "react-dom";

const cx = classNames.bind(styles);

function ChangeVisibility({ postId, visibility, token }) {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedVisibility, setSelectedVisibility] = useState(visibility);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // 🔥 Đồng bộ prop visibility -> state
  useEffect(() => {
    if (visibility) {
      setSelectedVisibility(visibility);
    }
  }, [visibility]);

  const handleChangeVisibility = async (newVisibility) => {
    if (newVisibility === visibility) return; // không gọi API nếu không thay đổi
    setLoading(true);
    const result = await changePostVisibility(postId, newVisibility, [], token);
    setLoading(false);
    if (result.success) {
      setSelectedVisibility(newVisibility);
      dispatch(updatePost(result.post));
    }
  };

  return (
    <>
      <span
        className={cx("action", "change-visibility")}
        onClick={() => setShowOptions(true)}
      >
        <FaGlobeAmericas /> <span>chế độ công khai</span>
      </span>

      {showOptions &&
        createPortal(
          <div className={cx("overlay")} onClick={() => setShowOptions(false)}>
            <div
              className={`${cx("options-dialog")} options-dialog`}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Chọn chế độ hiển thị</h3>

              {loading ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: 16,
                    marginBottom: 4,
                  }}
                >
                  <div className={cx("spinner-border")} />
                </div>
              ) : (
                <form className={cx("option-list")}>
                  <label className={cx("option-item")}>
                    <input
                      type="radio"
                      name="visibility"
                      value="friends"
                      checked={selectedVisibility === "friends"}
                      onChange={(e) => handleChangeVisibility(e.target.value)}
                    />
                    <span>Bạn bè</span>
                  </label>

                  <label className={cx("option-item")}>
                    <input
                      type="radio"
                      name="visibility"
                      value="custom"
                      checked={selectedVisibility === "custom"}
                      onChange={(e) => handleChangeVisibility(e.target.value)}
                    />
                    <span>Bạn bè ngoại trừ</span>
                  </label>

                  <label className={cx("option-item")}>
                    <input
                      type="radio"
                      name="visibility"
                      value="private"
                      checked={selectedVisibility === "private"}
                      onChange={(e) => handleChangeVisibility(e.target.value)}
                    />
                    <span>Chỉ mình tôi</span>
                  </label>
                </form>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

export default ChangeVisibility;
