import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames/bind";
import styles from "./customvisibility.module.css";

const cx = classNames.bind(styles);

function CustomVisibilityModal({
  initialSelected = [],
  onClose = () => {},
  onSave = () => {},
  friendList = [],
}) {
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState(initialSelected);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    setSelected(Array.isArray(initialSelected) ? initialSelected : []);
  }, [initialSelected]);

  if (!mounted || typeof document === "undefined") return null;

  const toggleSelect = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const list = Array.isArray(friendList) ? friendList : [];

  return createPortal(
    <div className={cx("overlay")} onClick={onClose}>
      <div
        className={`${cx("modal")} custom-visibility-modal`}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className={cx("title")}>Chọn bạn bè không thể xem</h3>

        {list.length === 0 ? (
          <p className={cx("empty")}>Không có bạn bè để hiển thị.</p>
        ) : (
          list.map((friend) => {
            const id = friend._id ?? friend.id ?? String(friend);
            const name = friend.name ?? friend.fullName ?? String(id);
            const avatar = friend.avatar ?? "/default-avatar.png";

            return (
              <label key={id} className={cx("friendItem")}>
                <input
                  type="checkbox"
                  className={cx("checkbox")}
                  checked={selected.includes(id)}
                  onChange={() => toggleSelect(id)}
                />
                <div className={cx("friendInfo")}>
                  <img src={avatar} alt={name} className={cx("avatar")} />
                  <span className={cx("friendName")}>{name}</span>
                </div>
              </label>
            );
          })
        )}

        <div className={cx("actions")}>
          <button className={cx("cancel")} onClick={onClose}>
            Hủy
          </button>
          <button
            className={cx("save")}
            onClick={() => {
              onSave([...selected]);
              onClose();
            }}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default CustomVisibilityModal;
