const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

// Lấy danh sách reaction (chỉ author mới gọi được)
export const getReactionList = async (postId, token) => {
  try {
    const res = await fetch(`${API_URL}/posts/${postId}/reactions/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json(); // 👈 lấy dữ liệu JSON
    return data; // { success, data: [ { userId, name, avatar, type } ] }
  } catch (error) {
    console.error("Lỗi khi gọi getReactionList:", error);
    return { success: false, error: error.message };
  }
};
