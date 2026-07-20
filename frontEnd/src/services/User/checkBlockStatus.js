const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

const checkBlockStatus = async (targetId) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${API_URL}/users/block-status/${targetId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Không thể kiểm tra trạng thái block",
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: "Lỗi server",
      error,
    };
  }
};

export default checkBlockStatus;
