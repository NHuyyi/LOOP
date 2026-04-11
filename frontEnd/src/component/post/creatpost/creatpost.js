import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import uploadImage from "../../../services/Post/uploadImage";
import newpost from "../../../services/Post/newpost";
import styles from "./creatpost.module.css";
import classNames from "classnames/bind";
import VisibilityCreatePost from "../visibilitycreatpost/visibilitycreatpost";
import { setPosts } from "../../../redux/postSlice";
import getpost from "../../../services/Post/getpost";

import Loading from "../../Loading/Loading";
const cx = classNames.bind(styles);

function CreatePost({ setMessage, setSuccess, friendList = [] }) {
  const [image, setImage] = useState(null); // file ảnh
  const [preview, setPreview] = useState(null); // để preview ảnh
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(""); // nội dung bài viết
  const [visibility, setVisibility] = useState("friends");
  const [denyList, setDenyList] = useState([]); // danh sách người bị chặn xem (khi custom)
  const dispatch = useDispatch();

  const stateUser = useSelector((state) => state.user);
  const currentUser = stateUser?.user;
  const author = currentUser?._id || "";

  // chọn file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // tạo link preview
    }
  };

  // submit
  const handleSubmit = async () => {
    if (!image || !content.trim()) {
      setMessage("Vui lòng nhập nội dung và chọn ảnh!");
      setSuccess(false);
      return;
    }

    setLoading(true);
    try {
      // Upload ảnh
      const imageRes = await uploadImage(image);
      const imageUrl = imageRes.data.url;

      // Tạo bài viết mới
      const post = await newpost(
        imageUrl,
        content,
        author,
        visibility,
        denyList,
      );
      if (post.success) {
        const postList = await getpost(friendList, author);
        if (postList && Array.isArray(postList.data)) {
          dispatch(setPosts(postList.data));
        }
      }
      setMessage(post.message);
      setSuccess(post.success);

      // reset sau khi đăng
      setImage(null);
      setPreview(null);
      setContent("");
      setVisibility("friends");
      setDenyList([]);
    } catch (error) {
      setMessage(error.message);
      setSuccess(false);
    } finally {
      setLoading(false);
      setImage(null);
      setPreview(null);
    }
  };

  return (
    <div className={cx("createPost")}>
      <h2 className={cx("title")}>📸 Tạo bài viết mới</h2>

      {/* Preview ảnh */}
      {/* Upload ảnh */}
      <input
        type="file"
        accept="image/*"
        id="upload"
        className={cx("fileInput")}
        onChange={handleFileChange}
      />

      {preview ? (
        <>
          <img src={preview} alt="preview" className={cx("preview")} />
          <label htmlFor="upload" className={cx("changeBtn")}>
            Đổi ảnh
          </label>
        </>
      ) : (
        <label htmlFor="upload" className={cx("uploadBox", "uploadIcon")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="4rem"
            viewBox="0 -960 960 960"
            width="4rem"
            fill="#8C1AF6"
          >
            <path d="M480-480ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h320v80H200v560h560v-320h80v320q0 33-23.5 56.5T760-120H200Zm40-160h480L570-480 450-320l-90-120-120 160Zm440-320v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z" />
          </svg>
        </label>
      )}

      {/* Nội dung */}
      <textarea
        className={cx("contentInput")}
        placeholder="Bạn đang nghĩ gì?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      {/* Chế độ công khai */}
      <VisibilityCreatePost
        visibility={visibility}
        setVisibility={setVisibility}
        setDenyList={setDenyList}
        friendList={friendList}
        denyList={denyList}
      />

      {/* Nút đăng */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className={cx("app-btn", "submitBtn")}
      >
        {loading ? <Loading size="small" /> : "🚀 Đăng bài"}
      </button>
    </div>
  );
}

export default CreatePost;
