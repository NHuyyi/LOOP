const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export const requestReactivateAPI = async (email, password) => {
    try {
        const res = await fetch(`${API_URL}/users/request-reactivate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        return await res.json();
    } catch (error) {
        return { success: false, message: "Lỗi kết nối server" };
    }
};