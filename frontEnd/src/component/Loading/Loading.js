import React from "react";
import styles from "./Loading.module.css";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function Loading({ size = "medium", fullScreen = false, text = "" }) {
  return (
    <div className={cx("loading-wrapper", { "full-screen": fullScreen })}>
      <div className={cx("spinner", size)}></div>
      {text && <span className={cx("loading-text")}>{text}</span>}
    </div>
  );
}

export default Loading;
