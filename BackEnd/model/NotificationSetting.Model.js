const mongoose = require("mongoose");

const NotificationSettingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    pushEnabled: { type: Boolean, default: true },
    messageSound: {
        enabled: { type: Boolean, default: true },
        soundType: { type: String, default: "pop" },
        volume: { type: Number, default: 0.8 },
    },
    defaultSound: {
        enabled: { type: Boolean, default: true },
        soundType: { type: String, default: "ding" },
        volume: { type: Number, default: 0.5 },
    },
    postSound: {
        enabled: { type: Boolean, default: true },
        soundType: { type: String, default: "Am_1" },
        volume: { type: Number, default: 0.8 },
    },
    typingSound: {
        enabled: { type: Boolean, default: true },
        soundType: { type: String, default: "Am_3" },
        volume: { type: Number, default: 0.3 },
    },
    messageStatusSound: {
        enabled: { type: Boolean, default: true },
        soundType: { type: String, default: "Am_2" },
        volume: { type: Number, default: 0.5 },
    },
    pushSubscriptions: [{ type: Object }]
}, { timestamps: true });

module.exports = mongoose.model("NotificationSetting", NotificationSettingSchema);