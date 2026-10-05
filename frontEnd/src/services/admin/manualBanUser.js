const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export const manualBanUser = async (targetUserId, penaltyLevel, reasonLabels = [], reportId) => {
    try {
        const token = localStorage.getItem("token");
        
        const res = await fetch(`${API_URL}/admin/manual-ban`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ targetUserId, penaltyLevel, reasonLabels, reportId }),
        });
        
        const data = await res.json();
        
        if (!res.ok) {
            return {
                success: false,
                message: data.message || "Lỗi khi áp dụng hình phạt",
            };
        }
        
        return data; 
    } catch (error) {
        console.error("Lỗi khi gọi API manualBanUser:", error);
        return { success: false, message: "Lỗi kết nối máy chủ" };
    }
};