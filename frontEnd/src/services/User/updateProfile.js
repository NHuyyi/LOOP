const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export const updateProfile = async (profileData) => {
  try {
    const res = await fetch(`${API_URL}/users/update-profile`, {
      method: "POST", // Hoặc PUT tùy vào việc bạn khai báo ở route
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      // Gửi toàn bộ object chứa name, avatar, bio, location... xuống BE
      body: JSON.stringify(profileData),
    });

    return await res.json();
  } catch (error) {
    console.error("Lỗi khi gọi API updateProfile:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};