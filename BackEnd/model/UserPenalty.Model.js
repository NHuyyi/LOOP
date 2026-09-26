const mongoose = require("mongoose");

const userPenaltySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    // Thang điểm hình phạt (0 đến 5)
    penaltyLevel: {
        type: Number,
        default: 0,
        enum: [0, 1, 2, 3, 4, 5]
        // 0: Bình thường
        // 1: Khóa 1 ngày
        // 2: Khóa 1 tuần
        // 3: Khóa 1 tháng
        // 4: Khóa 1 năm
        // 5: Chờ Admin duyệt khóa vĩnh viễn
    },
    banUntil: {
        type: Date,
        default: null // Thời điểm được tự động mở khóa
    },
    lastUnbannedAt: {
        type: Date,
        default: null // Mốc thời gian được mở khóa gần nhất (để tính thời gian thử thách 1 tuần)
    },
    isPendingPermanent: {
        type: Boolean,
        default: false // Cờ bật lên khi đạt Level 5, chờ Admin xử lý thủ công
    },
    history: [{
        levelApplied: Number,
        reasonLabels: [String], // Các nhãn vi phạm gom lại
        appliedAt: { type: Date, default: Date.now },
        type: { type: String, enum: ["auto", "manual"] } // Lưu vết do tự động khóa hay do Admin tự khóa
    }]
}, { timestamps: true });

module.exports = mongoose.model("UserPenalty", userPenaltySchema);