import React, { useEffect, useRef } from "react";
import classNames from "classnames/bind";
import styles from "./MessageInput.module.css";
import { useCustomEmojis } from "../../../hooks/useCustomEmojis";
import { Smile } from "lucide-react";

const cx = classNames.bind(styles);

function EmojiStickerPicker({ onSelectMyIcon, onClose }) {
  const pickerRef = useRef(null);
  const { emojis: myIcons } = useCustomEmojis();

  // This effect listens for clicks outside the picker to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div ref={pickerRef} className={cx("picker-container")}>
      <div
        className={cx("picker-header")}
        style={{
          padding: "10px",
          borderBottom: "1px solid #ddd",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        <Smile size={22} />
      </div>
      <div
        className={cx("picker-body")}
        style={{ padding: "10px", maxHeight: "250px", overflowY: "auto" }}
      >
        <div
          className={cx("picker-grid")}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            justifyContent: "center",
          }}
        >
          {myIcons.map((iconObj, index) => (
            <img
              key={index}
              src={iconObj.icon}
              alt={iconObj.type}
              title={iconObj.type}
              className={cx("sticker-item")}
              style={{
                width: "45px",
                height: "45px",
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
              onClick={() => onSelectMyIcon(iconObj)}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.2)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default EmojiStickerPicker;
