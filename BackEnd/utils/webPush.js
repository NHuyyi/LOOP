// Đây là file config webpush dùng để cấu hình và kết nối đến các Push Service

// Thư viện chuẩn mã nguồn mở của node.js dùng để mã hóa và gửi thông báo đẩy an toàn chuẩn VAPID từ server đến các Push Service của trình duyệt
const webpush = require('web-push');

webpush.setVapidDetails(
    `mailto:${process.env.EMAIL_USER}`,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

module.exports = webpush;