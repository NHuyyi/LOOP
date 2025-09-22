// services/uploadImage.js
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

const uploadImage = async (imageFile) => {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("image", imageFile);
  try {
    const res = await fetch(`${API_URL}/posts/uploadImage`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) {
      return {
        success: data.success,
        status: res.status,
        message: data.message || "OTP không hợp lệ",
      };
    }

    return { data };
  } catch (error) {
    console.error("Lỗi khi gọi API UploadImage:", error);
    throw error;
  }
};

export default uploadImage;
