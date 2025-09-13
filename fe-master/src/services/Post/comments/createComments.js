const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

const createComment = async (postId, text, token) => {
  try {
    const res = await fetch(`${API_URL}/posts/createComments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ postId, text }),
    });
    const data = await res.json();
    if (!res.ok) {
      return {
        success: data.success,
        status: res.status,
        message:
          data.message || "Thêm bình luận thất bại, vui lòng kiểm tra lại",
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

export default createComment;
