// Hàm chuyển đổi key (Giữ nguyên của bạn) vì VAPID định dạng ở chuỗi base64
// Nhung hàm pushManager.subscribe() nhận vào là một Uint8Array
// Hàm này có tác dụng chuyển base64 sang Uint8Array
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
    // Kiểm tra xem trình duyệt có hỗ trợ Service Worker và PushManager không
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        return console.log('Trình duyệt không hỗ trợ Web Push');
    }

    try {
        // Cài đặt service worker vào trình duyệt để nó bắt đầu chạy ngầm
        const registration = await navigator.serviceWorker.register('/sw.js');

        // Yêu cầu người dùng cho phép hiển thị thông báo
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return;

        // Lấy public VAPID key (Lấy từ file .env)
        const publicVapidKey = process.env.REACT_APP_PUBLIC_VAPID_KEY;

        // Tạo subscription kết nối với máy chủ của google/ apple/ mozilla để xin một địa chỉ endpoint độc nhất cho thiết bị này
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
        });

        // Lưu subscription vào localStorage

        // Lấy token từ localStorage và gọi API để lưu subscription vào database
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