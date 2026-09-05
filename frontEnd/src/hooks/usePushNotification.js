// Hàm chuyển đổi key (Giữ nguyên của bạn)
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export const subscribeToPush = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        return console.log('Trình duyệt không hỗ trợ Web Push');
    }

    try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return;

        const publicVapidKey = "BGwCdLMsdILqaZbYxXTNBAFITMTITTXjsmvxJOUu7WRfiqbaVpwc11A_w0oQ4zBCHd5_rb3k3_uftoCWD_1fkSg";

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
        });

        // --- PHẦN CODE THÊM MỚI ĐỂ GỬI LÊN BACKEND ---
        const token = localStorage.getItem("token");
        if (token) {
            await fetch(`${API_URL}/notification/subscribe-push`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ subscription })
            });
            console.log("Đã lưu thiết bị nhận thông báo thành công!");
        }
    } catch (error) {
        console.error("Lỗi khi đăng ký Web Push:", error);
    }
};