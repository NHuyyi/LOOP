const mongoose = require("mongoose");

const StickerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    price: { type: Number, required: true, default: 100 },
    description: { type: String },
});

module.exports = mongoose.model("Sticker", StickerSchema);