const Sticker = require("../../model/Sticker.Model");
const User = require("../../model/User.Model");

exports.buySticker = async (req, res) => {
    try {
        const userId = req.user.id;
        const { stickerId } = req.body;

        const user = await User.findById(userId);
        const sticker = await Sticker.findById(stickerId);

        if (!sticker) return res.status(404).json({ success: false, message: "Sticker không tồn tại" });

        // Kiểm tra xem đã mua chưa
        if (user.ownedStickers.includes(stickerId)) {
            return res.status(400).json({ success: false, message: "Bạn đã sở hữu sticker này rồi" });
        }

        // Kiểm tra tiền
        if (user.coins < sticker.price) {
            return res.status(400).json({ success: false, message: "Ngân khố không đủ" });
        }

        // Trừ tiền và thêm sticker
        user.coins -= sticker.price;
        user.ownedStickers.push(stickerId);
        await user.save();

        return res.status(200).json({ success: true, message: "Mua thành công!", coins: user.coins });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server" });
    }
};