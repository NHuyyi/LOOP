const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export const getShopItems = async () => {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/shop/stickers`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách cửa hàng:", error);
        return { success: false, message: "Lỗi kết nối server" };
    }
};