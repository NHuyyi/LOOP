const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export const updatePrivacyAPI = async (privacyData) => {
    try {
        const res = await fetch(`${API_URL}/users/update-privacy`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(privacyData),
        });
        return await res.json();
    } catch (error) {
        console.error("Lỗi khi gọi API updatePrivacy:", error);
        return { success: false, message: "Lỗi mạng hoặc server" };
    }
};