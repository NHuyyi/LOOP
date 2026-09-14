const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export const getNotificationList = async () => {
    const token = localStorage.getItem("token");
    try {
        const res = await fetch(`${API_URL}/notification/list`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` }
        });
        return await res.json();
    } catch (error) {
        return { success: false };
    }
};