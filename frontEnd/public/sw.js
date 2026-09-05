// public/sw.js
self.addEventListener('push', function (event) {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            // Ưu tiên avatar từ BE gửi sang, nếu không có (hoặc lỗi) thì dùng logo mặc định ở thư mục public
            icon: '/logo.png',
            // Badge là icon siêu nhỏ hiện ở thanh trạng thái (Android/Windows), nên dùng logo tĩnh
            badge: '/logo.png',
            data: data.url // URL để mở khi click vào thông báo
        };

        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close(); // Đóng pop-up thông báo

    const targetUrl = event.notification.data || '/';

    // Mở tab mới hoặc focus vào tab đang mở có URL tương ứng
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            // Nếu đã có tab nào đang mở trang web của bạn, dùng tab đó chuyển hướng
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url.includes(self.registration.scope) && 'focus' in client) {
                    client.navigate(targetUrl); // Chuyển hướng tab hiện tại đến bài viết
                    return client.focus();
                }
            }
            // Nếu web đang đóng hoàn toàn, mở tab mới
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});