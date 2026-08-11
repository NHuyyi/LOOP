const mongoose = require("mongoose");

const UserProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true, // Đảm bảo mối quan hệ 1-1
        },
        coverPhoto: {
            type: String,
            default: "https://res.cloudinary.com/dpym64zg9/image/upload/v1755614090/raw_cq4nqn.png", // Hoặc một link ảnh bìa mặc định khác
        },
        bio: {
            type: String,
            maxLength: 255, // Giới hạn độ dài tiểu sử
            default: "",
        },
        phoneNumber: {
            type: String,
            default: "",
        },
        gender: {
            type: String,
            enum: ["Nam", "Nữ", "Khác", "Bí mật"],
            default: "Bí mật",
        },
        dateOfBirth: {
            type: Date,
            default: null,
        },
        location: {
            type: String, // Ví dụ: "Hồ Chí Minh, Việt Nam"
            default: "",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("UserProfile", UserProfileSchema);