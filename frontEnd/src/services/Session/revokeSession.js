const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export const revokeSession = async (sessionId) => {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/session/revoke/${sessionId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ sessionId }),
        });
        return await res.json();
    } catch (error) {
        return { success: false, message: "Lỗi kết nối server" };
    }
};