const webpush = require("./webPush");
const NotificationSetting = require("../model/NotificationSetting.Model");

const sendPushNotification = async (userId, title, body, url) => {
  try {
    const settings = await NotificationSetting.findOne({ userId });
    if (!settings || !settings.pushSubscriptions || settings.pushSubscriptions.length === 0) {
      return;
    }
    const payload = JSON.stringify({ title, body, url });

    // Mảng lưu trữ các endpoint đã chết
    let expiredEndpoints = [];

    await Promise.all(
      settings.pushSubscriptions.map(async (subscription) => {
        try {
          await webpush.sendNotification(subscription, payload);
        } catch (error) {
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