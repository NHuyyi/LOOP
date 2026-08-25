const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export const updateSettingsSounds = async (settings) => {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}/notification/update-settings-sounds`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(settings),
        });

        const data = await response.json();
        if (!response.ok) {
            return {
                success: false,
                status: response.status,
                message:
                    data.message || "Cập nhật cài đặt âm thanh thất bại",
            };
        }
        return data;
    } catch (error) {
        console.error("Lỗi khi cập nhật cài đặt âm thanh:", error);
        return { success: false, message: "Lỗi server" };
    }
}

