const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export const getBlockList = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/users/blocked-list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Lỗi lấy danh sách block",
      };
    }
    return data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách block:", error);
    return {
      success: false,
      message: "Lỗi server",
    };
  }
};
