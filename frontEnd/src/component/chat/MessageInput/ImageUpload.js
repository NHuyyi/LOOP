import React, { useRef } from "react";
import { Image } from "lucide-react";
import classNames from "classnames/bind";
import styles from "./MessageInput.module.css"; 

const cx = classNames.bind(styles);

function ImageUpload({ onImageSelect, isUploading }) {
  const fileInputRef = useRef(null);

  const handleIconClick = () => {
    if (!isUploading) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImageSelect(file, URL.createObjectURL(file));
    }
    // Reset value để nếu xoá ảnh rồi chọn lại đúng ảnh đó vẫn hoạt động
    e.target.value = ""; 
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <button 
        type="button" 
        className={cx("actionBtn")} 
        onClick={handleIconClick}
        disabled={isUploading}
      >
        <Image size={22} />
      </button>
    </>
  );
}

export default ImageUpload;