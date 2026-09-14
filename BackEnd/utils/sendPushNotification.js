// Kiểm tra các thiết bị của người dùng (subscription), thực thi việc gửi thông báo tới các thiết bị đo, và tự động dọn dẹp các thiết bị không còn tồn tại

const webpush = require("./webPush");
const NotificationSetting = require("../model/NotificationSetting.Model");

const sendPushNotification = async (userId, title, body, url) => {
  try {
    // Tìm kiếm cài đặt thông báo của user
    const settings = await NotificationSetting.findOne({ userId });
    // Kiểm tra user có tồn tại cài đặt thông báo, có bật thông báo push không và có ít nhất 1 subscription không
    if (!settings || !settings.pushEnabled || !settings.pushSubscriptions || settings.pushSubscriptions.length === 0) {
      return;
    }
    // Đóng gói dữ liệu thông báo thành chuỗi Json
    const payload = JSON.stringify({ title, body, url });

    // Mảng lưu trữ các endpoint đã chết
    let expiredEndpoints = [];

    // Chạy vòng lặp song song để gửi thông báo đến nhiều thiết bị cùng lúc
    await Promise.all(
      settings.pushSubscriptions.map(async (subscription) => {
        try {
          // Hàm đặc biệt yêu cầu Server bắn gói tin payload tới địa chỉ endpoint nằm trong subscription
          await webpush.sendNotification(subscription, payload);
        } catch (error) {
          // Nếu gặp lỗi 410, 404 thì do endpoint đã chết
          if (error.statusCode === 410 || error.statusCode === 404) {
            console.log(`Phát hiện endpoint hết hạn của user ${userId}`);
            expiredEndpoints.push(subscription.endpoint); // Đưa vào danh sách xóa
          } else {
            console.error("Lỗi push không xác định:", error);
          }
        }
      })
    );

    // Xóa các endpoint chết khỏi DB
    if (expiredEndpoints.length > 0) {
      settings.pushSubscriptions = settings.pushSubscriptions.filter(
        (sub) => !expiredEndpoints.includes(sub.endpoint)
      );

      // BẮT BUỘC: Thông báo cho Mongoose mảng Object tự do đã bị thay đổi
      settings.markModified("pushSubscriptions");
      await settings.save();
      console.log(`Dọn dẹp thành công ${expiredEndpoints.length} subscription lỗi ra khỏi DB!`);
    }
  } catch (error) {
    console.error("Lỗi cấu hình gửi push:", error);
  }
};

module.exports = sendPushNotification;