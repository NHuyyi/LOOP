const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export const getAllUsers = async () => {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/admin/users`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Lỗi khi gọi API getAllUsersAdmin:", error);
        return { success: false, message: "Lỗi server" };
    }
};