const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export const closeAdminChatAPI = async (conversationId) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/admin/close-admin-chat/${conversationId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    return await res.json();
};