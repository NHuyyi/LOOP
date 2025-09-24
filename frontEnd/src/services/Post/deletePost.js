const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

const deletePost = async (postId, token) => {
  try {
    const res = await fetch(`${API_URL}/posts/delete/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ postId: postId }),
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        status: res.status,
        message: data.message || "Xóa bài viết thất bại, vui lòng kiểm tra lại",
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
export default deletePost;
