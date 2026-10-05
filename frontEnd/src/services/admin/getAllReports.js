const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

// 1. API Lấy danh sách báo cáo (Hỗ trợ phân trang và lọc)
export const getAllReports = async (page = 1, limit = 10, status = "", reportedUserId = "", reasonLabel = "") => {
    try {
        const token = localStorage.getItem("token");

        // Tạo query string linh hoạt
        const queryParams = new URLSearchParams({ page, limit });
        if (status) queryParams.append("status", status);
        if (reportedUserId) queryParams.append("reportedUserId", reportedUserId);
        if (reasonLabel) queryParams.append("reasonLabel", reasonLabel);

        const res = await fetch(`${API_URL}/admin/reports?${queryParams.toString()}`, {
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
                message: data.message || "Lỗi tải danh sách báo cáo",
            };
        }

        return data;
    } catch (error) {
        console.error("Lỗi khi gọi API getAllReports:", error);
        return { success: false, message: "Lỗi kết nối máy chủ" };
    }
};
