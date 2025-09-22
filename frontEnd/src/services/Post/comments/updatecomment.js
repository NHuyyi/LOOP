const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

const updateComment = async (postId, commentId, newtext, token) => {
  try {
    const res = await fetch(`${API_URL}/posts/update/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ postId, commentId, newtext }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        status: res.status,
        message:
          data.message || "Cập nhật bình luận thất bại, vui lòng kiểm tra lại",
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
export default updateComment;
