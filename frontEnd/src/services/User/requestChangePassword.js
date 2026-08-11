const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export const requestChangePassword = async () => {
    try {
        const res = await fetch(`${API_URL}/users/request-change-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return await res.json();
    } catch (error) {
        return { success: false, message: "Lỗi server" };
    }
};