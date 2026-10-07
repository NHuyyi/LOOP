const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export const buySticker = async (stickerId) => {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/shop/buy`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ stickerId }),
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Lỗi khi mua sticker:", error);
        return { success: false, message: "Lỗi kết nối server" };
    }
};