const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export const deactivateAccount = async () => {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/users/deactivate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return await res.json();
    } catch (error) {
        return { success: false, message: "Lỗi server" };
    }
};