const Sticker = require("../../model/Sticker.Model");

exports.getShopItems = async (req, res) => {
    try {
        const stickers = await Sticker.find();
        return res.status(200).json({ success: true, stickers });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server" });
    }
};