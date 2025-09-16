const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export const getCommentList = async (postId, token) => {
  try {
    const res = await fetch(`${API_URL}/posts/${postId}/comments/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        status: res.status,
        error: data.error || "Lấy danh sách comment thất bại",
      };
    }

    // BE trả về { success, count, data }
    return data;
  } catch (error) {
    console.error("Lỗi khi gọi getCommentList:", error);
    return { success: false, error: error.message };
  }
};
