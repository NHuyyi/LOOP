const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

const getFriendListFilter = async (userId) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${API_URL}/friends/getFriendListFilter`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: data.success,
        status: res.status,
        message:
          data.message ||
          "Lấy danh sách bạn bè theo bộ lọc thất bại, vui lòng kiểm tra thông tin",
      };
    }
    return data;
  } catch (error) {
    console.error("Lỗi server:", error);
    throw error;
  }
};

export default getFriendListFilter;
