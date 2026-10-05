const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export const rejectReportAPI = async (reportId) => {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/admin/reject-report`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ reportId}),
        });
        return await res.json();
    } catch (error) {
        return { success: false, message: "Lỗi máy chủ" };
    }
};