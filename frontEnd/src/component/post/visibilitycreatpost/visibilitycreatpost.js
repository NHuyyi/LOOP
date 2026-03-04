import { useState } from "react";
import classNames from "classnames/bind";
import styles from "./VisibilityCreatePost.module.css";
import { FaGlobeAmericas } from "react-icons/fa";
import { createPortal } from "react-dom";
import CustomVisibilityModal from "../CustomVisibility/CustomVisibility";

const cx = classNames.bind(styles);

function VisibilityCreatePost({
  visibility,
  setVisibility,
  setDenyList,
  denyList,
  friendList = [],
}) {
  const [showOptions, setShowOptions] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const handleSelectVisibility = (option) => {
    if (option === "custom") {
      // 👉 mở modal custom thay vì đóng luôn
      setShowOptions(false);
      setShowCustomModal(true);
    } else {
      setVisibility(option);
      setDenyList([]); // reset nếu không phải custom
      setShowOptions(false);
    }
  };
  return (
    <>
      <span
        className={cx("action", "change-visibility")}
        onClick={() => {
          setShowOptions(true);
        }}
      >
        <FaGlobeAmericas />
      </span>
      {showOptions &&
        createPortal(
          <div className={cx("overlay")} onClick={() => setShowOptions(false)}>
            <div
              className={`${cx("options-dialog")} options-dialog`}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Chọn chế độ hiển thị</h3>
              <ul className={cx("options-list")}>
                <li
                  className={cx(
                    "option-item",
                    visibility === "friends" ? "selected" : "",
                  )}
                  onClick={() => handleSelectVisibility("friends")}
                >
                  Bạn bè
                </li>
                <li
                  className={cx(
                    "option-item",
                    visibility === "private" ? "selected" : "",
                  )}
                  onClick={() => handleSelectVisibility("private")}
                >
                  Chỉ mình tôi
                </li>
                <li
                  className={cx(
                    "option-item",
                    visibility === "custom" ? "selected" : "",
                  )}
                  onClick={() => {
                    setShowCustomModal(true);
                  }}
                >
                  Bạn bè ngoại trừ...
                </li>
              </ul>
            </div>
          </div>,
          document.body,
        )}

      {/* 🔹 Modal custom tách riêng */}
      {showCustomModal && (
        <CustomVisibilityModal
          initialSelected={denyList}
          friendList={friendList}
          onClose={() => setShowCustomModal(false)}
          onSave={(list) => {
            if (list.length === 0) {
              // Nếu không chọn ai thì coi như "friends"
              setVisibility("friends");
              setDenyList([]);
            } else {
              setVisibility("custom");
              setDenyList(list); // ✅ cập nhật denyList
            }
            setShowCustomModal(false);
          }}
        />
      )}
    </>
  );
}
export default VisibilityCreatePost;
