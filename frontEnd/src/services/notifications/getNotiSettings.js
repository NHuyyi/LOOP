const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export const getSettingsSounds = async () => {
    try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/notification/get-settings-sounds`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        const data = await res.json();
        if (!res.ok) {
            return {
                success: false,
                status: res.status,
                message:
                    data.message || "Lây cài đặt âm thanh thất bại",
            };
        }
        return data;
    } catch (error) {
        console.error("Lỗi khi lấy cài đặt âm thanh:", error);
        return { success: false, message: "Lỗi server" };
    }
};
