const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export const markNotificationsAsReadAPI = async (notiId) => {
    const token = localStorage.getItem("token");
    try {
        const res = await fetch(`${API_URL}/notification/mark-read/${notiId}`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` }
        });
        return await res.json();
    } catch (error) {
        return { success: false };
    }
};