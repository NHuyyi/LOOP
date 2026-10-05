const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
    reporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reportedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reasonLabel: {
        type: String,
        required: true,
        enum: ["spam", "harassment", "hate_speech", "inappropriate_content", "other"]
    },
    description: {
        type: String,
        default: ""
    },
    evidenceImage: { type: String, default: "" },
    // THÊM TRƯỜNG NÀY: Trạng thái của lá đơn tố cáo
    status: {
        type: String,
        enum: ["pending", "processed"],
        default: "pending"
        // pending: Đang tích lũy chờ đủ 5 vé để phạt
        // processed: Đã được hệ thống dùng để tính toán hình phạt (hoặc bị admin bỏ qua)
    },
    actionTaken: {
        type: String,
        enum: ["banned", "rejected", "none"],
        default: "none"
    }
}, { timestamps: true });

// SỬA LẠI INDEX: Chống spam thông minh (Sử dụng Partial Filter của MongoDB)
// Ý nghĩa: Một người chỉ được phép có TỐI ĐA 1 ĐƠN "PENDING" đối với 1 mục tiêu.
// Khi đơn cũ đã được "processed", họ hoàn toàn có thể tạo đơn "pending" mới.
reportSchema.index(
    { reporter: 1, reportedUser: 1 },
    {
        unique: true,
        partialFilterExpression: { status: "pending" }
    }
);

module.exports = mongoose.model("Report", reportSchema);