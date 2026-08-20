const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export const getActiveSessions = async () => {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/session/active`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await res.json()


        if (!res.ok) {
            return {
                success: data.success,
                status: res.status,
                message:
                    data.message || "Lây danh sách thiết bị thất bại",
            };
        }

        return data;

    } catch (error) {
        return { success: false, message: "Lỗi kết nối server" };
    }
};