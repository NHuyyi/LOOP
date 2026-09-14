// Lắng nghe sự kiện push do hệ điều hành nhận được từ server
self.addEventListener('push', function (event) {
    if (event.data) {
        const data = event.data.json(); // Ép dữ liệu json sang dạng JS
        const options = {
            body: data.body,
            // Ưu tiên avatar từ BE gửi sang, nếu không có (hoặc lỗi) thì dùng logo mặc định ở thư mục public
            icon: '/logo.png',
            // Badge là icon siêu nhỏ hiện ở thanh trạng thái (Android/Windows), nên dùng logo tĩnh
            badge: '/logo.png',
            data: data.url // URL để mở khi click vào thông báo
        };

        // Hàm đặc biệt yêu cầu Service Worker chờ quá trình hiển thị pop-up (showNotification) hoàn tất rồi mới kết thúc tiến trình ngầm
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Lắng nghe sự kiện click vào thông báo
self.addEventListener('notificationclick', function (event) {
    event.notification.close(); // Đóng pop-up thông báo

    const targetUrl = event.notification.data || '/';

    // Mở tab mới hoặc focus vào tab đang mở có URL tương ứng
    event.waitUntil(
        //Hàm đặc biệt, quét xem trình duyệt có đang mở tab nào thuộc về website của bạn không.
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            // Nếu đã có tab nào đang mở trang web của bạn, dùng tab đó chuyển hướng
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];

                // self.registration.scope là phạm vi URL mà Service Worker đang kiểm soát (thường là domain gốc của ứng dụng
                // client.url.includes(self.registration.scope) kiểm tra xem url có nằm trong phạm vi của service worker không
                // 'focus' in client: Kiểm tra xem đối tượng client này có hỗ trợ phương thức focus hay không.
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