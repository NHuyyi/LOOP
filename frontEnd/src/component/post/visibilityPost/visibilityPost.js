import { useState, useEffect } from "react";
import changePostVisibility from "../../../services/Post/postvisibility";
import classNames from "classnames/bind";
import { updatePost } from "../../../redux/postSlice";
import { useDispatch } from "react-redux";
import styles from "./changevisibility.module.css";
import { FaGlobeAmericas } from "react-icons/fa";
import { createPortal } from "react-dom";
import CustomVisibilityModal from "../CustomVisibility/CustomVisibility";
import Loading from "../../Loading/Loading";
const cx = classNames.bind(styles);

function ChangeVisibility({
  postId,
  visibility,
  denyList = [],
  token,
  friendList = [],
}) {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedVisibility, setSelectedVisibility] = useState(visibility);
  const [restrictedList, setRestrictedList] = useState(denyList);
  const [showCustomModal, setShowCustomModal] = useState(false); // 🔹 quan trọng
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (visibility) setSelectedVisibility(visibility);
  }, [visibility]);

  const handleChangeVisibility = async (newVisibility, customList = []) => {
    setLoading(true);
    const result = await changePostVisibility(
      postId,
      newVisibility,
      customList,
      token,
    );
    setLoading(false);

    if (result.success) {
      setSelectedVisibility(newVisibility);
      setRestrictedList(customList);
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
                <Loading size="small" />
              ) : (
                <form className={cx("option-list")}>
                  <label className={cx("option-item")}>
                    <input
                      type="radio"
                      name="visibility"
                      value="friends"
                      checked={selectedVisibility === "friends"}
                      onChange={() => handleChangeVisibility("friends")}
                    />
                    <span>Bạn bè</span>
                  </label>

                  <label className={cx("option-item")}>
                    <input
                      type="radio"
                      name="visibility"
                      value="custom"
                      checked={selectedVisibility === "custom"}
                      // ❌ Không set selectedVisibility ở đây nữa
                      onClick={() => {
                        setShowCustomModal(true); // luôn mở modal khi click
                      }}
                      readOnly // tránh warning do không dùng onChange
                    />
                    <span>Bạn bè ngoại trừ...</span>
                  </label>

                  <label className={cx("option-item")}>
                    <input
                      type="radio"
                      name="visibility"
                      value="private"
                      checked={selectedVisibility === "private"}
                      onChange={() => handleChangeVisibility("private")}
                    />
                    <span>Chỉ mình tôi</span>
                  </label>
                </form>
              )}
            </div>
          </div>,
          document.body,
        )}

      {/* 🔹 Modal custom tách riêng */}
      {showCustomModal && (
        <CustomVisibilityModal
          initialSelected={restrictedList}
          onClose={() => setShowCustomModal(false)}
          onSave={(list) => {
            if (list.length === 0) {
              // ❌ Không chọn ai thì coi như không áp dụng custom
              setSelectedVisibility("friends");
              handleChangeVisibility("friends");
            } else {
              setSelectedVisibility("custom");
              handleChangeVisibility("custom", list);
            }
            setShowCustomModal(false);
            setShowOptions(false);
          }}
          friendList={friendList}
        />
      )}
    </>
  );
}

export default ChangeVisibility;
