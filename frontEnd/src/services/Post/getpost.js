const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

const getpost = async (friendIds, userId) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${API_URL}/posts/getNewsFeed`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ friendIds, userId }),
    });
    const data = await res.json();
    if (!res.ok) {
      return {
        success: data.success,
        status: res.status,
        message:
          data.message || "Lấy bài viết thất bại, vui lòng kiểm tra thông tin",
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

export default getpost;
