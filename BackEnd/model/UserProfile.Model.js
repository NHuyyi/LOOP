const mongoose = require("mongoose");

const UserProfileSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
        coverPhoto: { type: String, default: "..." },
        bio: { type: String, maxLength: 255, default: "" },

        // NHÓM 1: Thông tin nhạy cảm (Cần Streak > 10)
        phoneNumber: { type: String, default: "" },
        dateOfBirth: { type: Date, default: null },
        location: { type: String, default: "" },
        relationship: { type: String, enum: ["Độc thân", "Đang hẹn hò", "Đã kết hôn"], default: "Độc thân" },
        hobbies: [{ type: String }],

        // NHÓM 2: Thông tin cơ bản (Công khai)
        gender: { type: String, enum: ["Nam", "Nữ", "Khác", "Bí mật"], default: "Bí mật" },
        workplace: { type: String, default: "" },
        education: { type: String, default: "" },

        // NHÓM 3: Mạng xã hội linh hoạt (Công khai)
        socialLinks: [
            {
                platform: { type: String }, // VD: "Facebook", "Github", "Website"
                url: { type: String }       // VD: "https://github.com/..."
            }
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model("UserProfile", UserProfileSchema);