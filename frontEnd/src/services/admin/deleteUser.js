const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export const hardDeleteUser = async (targetUserId, confirmEmail) => {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/admin/hard-delete-user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ targetUserId, confirmEmail }),
        });
        const data = await res.json();
        if (!res.ok) {
            return {
                success: false,
                message: data.message || "Lỗi xóa cuộc trò chuyện",
            };
        }
        return {
            success: true,
            message: data.message || "Xóa thành công",
        };
    } catch (error) {
        console.error("Lỗi khi gọi API hardDeleteUser:", error);
        return { success: false, message: "Lỗi server" };
    }
};