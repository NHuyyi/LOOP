const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

const countreaction = async (postId) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${API_URL}/posts/countReactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ postId }),
    });
    const data = await res.json();
    if (!res.ok) {
      return {
        success: data.success,
        status: res.status,
        message:
          data.message || "Đếm reaction thất bại, vui lòng kiểm tra thông tin",
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

export default countreaction;
