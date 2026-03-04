const mongoose = require('mongoose');
// lưu nội dung chi tiết của tin nhắn

const MessageSchema = new mongoose.Schema(
    {
        conversationId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            required: true,
        },
        senderId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text:{
            type: String,
            required: true,
        },
        isRead:{
            type: Boolean,
            default: false,
        },
        isdeleted:{
            type: Boolean,
            default: false,
        }
    },
        {timestamps: true}
    );