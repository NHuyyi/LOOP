const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

const editPost = async (postId, newContent, token) => {
  try {
    const res = await fetch(`${API_URL}/posts/edit/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ postId, newContent }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        status: res.status,
        message:
          data.message || "Cập nhật bài viết thất bại, vui lòng kiểm tra lại",
      };
    }
    return data;
  } catch (err) {
    return {
      success: false,
      message: "Lỗi server",
      error: err,
    };
  }
};
export default editPost;
