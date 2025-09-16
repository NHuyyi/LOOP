const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";
const reactComment = async (postId, userId, commentId, reactionType) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${API_URL}/posts/reactcomment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ postId, userId, commentId, reactionType }),
    });
    const data = await res.json();
    if (!res.ok) {
      return {
        success: data.success,
        status: res.status,
        message:
          data.message ||
          "Thêm phản ứng bình luận thất bại, vui lòng kiểm tra lại",
      };
    }
    return data;
  } catch (error) {
    return {
      success: false,
      message: "Lỗi server",
      error: error,
    };
  }
};

export default reactComment;
