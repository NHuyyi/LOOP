const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

const blockUser = async (targetId) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${API_URL}/users/toggle-block`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ targetId }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Thao tác block thất bại",
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

export default blockUser;
