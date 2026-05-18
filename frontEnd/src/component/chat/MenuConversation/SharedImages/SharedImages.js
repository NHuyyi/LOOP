import React from "react";
import style from "./SharedImages.module.css";
import classNames from "classnames/bind";

const cx = classNames.bind(style);

function SharedImages({ chatImages = [] }) {
  console.log(
    "chatImages:",
    chatImages.length > 0 ? chatImages : "Không có ảnh nào được chia sẻ.",
  );
  console.log("chatImages.length:", chatImages.length > 0);
  return (
    <div className={cx("wrapper")}>
      {chatImages.length > 0 ? (
        <div className={cx("imageGrid")}>
          {chatImages.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`shared-img-${index}`}
              className={cx("gridImage")}
            />
          ))}
        </div>
      ) : (
        <div className={cx("emptyMessage")}>Không có ảnh nào được chia sẻ.</div>
      )}
    </div>
  );
}

export default SharedImages;
