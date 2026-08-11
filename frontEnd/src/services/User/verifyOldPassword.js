const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export const verifyOldPassword = async (oldPassword) => {
    try {
        const res = await fetch(`${API_URL}/users/verify-old-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ oldPassword }),
        });
        return await res.json();
    } catch (error) {
        return { success: false, message: "Lỗi server" };
    }
};