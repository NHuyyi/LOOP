const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

const addreaction = async (postId, userId, reactionType) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${API_URL}/posts/addReaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ postId, userId, reactionType }),
    });
    const data = await res.json();
    if (!res.ok) {
      return {
        success: data.success,
        status: res.status,
        message:
          data.message || "Thêm phản ứng thất bại, vui lòng kiểm tra thông tin",
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

export default addreaction;
