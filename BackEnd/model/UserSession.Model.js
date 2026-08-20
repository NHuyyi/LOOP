const mongoose = require("mongoose");

const UserSessionSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        deviceId: { type: String, required: true }, // Khóa định danh thiết bị
        deviceName: { type: String }, // vd: Windows, Mac, iOS
        browserName: { type: String }, // vd: Chrome, Safari
        ipAddress: { type: String },
        location: { type: String }, // Thành phố, Quốc gia
        geoIp: { type: String }, // Toạ độ (lat, lng)
        isActive: { type: Boolean, default: true },
        lastActiveAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

// Tạo index để truy vấn nhanh và đảm bảo mỗi user chỉ có 1 record duy nhất cho mỗi thiết bị
UserSessionSchema.index({ userId: 1, deviceId: 1 }, { unique: true });

module.exports = mongoose.model("UserSession", UserSessionSchema);