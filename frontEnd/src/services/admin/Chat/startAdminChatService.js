const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export const startAdminChatAPI = async (targetUserId) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/admin/start-admin-chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetUserId }),
    });
    return await res.json();
};