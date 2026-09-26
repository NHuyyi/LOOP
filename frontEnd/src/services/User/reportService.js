const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export const submitReport = async (reportedUserId, reasonLabel, description = "", evidenceImage = "") => {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/admin/create-report`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ reportedUserId, reasonLabel, description, evidenceImage }),
        });

        const data = await res.json();

        if (!res.ok) {
            return {
                success: false,
                message: data.message || "Không thể gửi báo cáo",
            };
        }

        return data;
    } catch (error) {
        console.error("Lỗi khi gọi API submitReport:", error);
        return { success: false, message: "Lỗi kết nối máy chủ" };
    }
};