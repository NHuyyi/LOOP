// Hàm 1: Tính toán thời hạn khóa (banUntil) dựa trên Level
exports.calculateBanDuration = (level) => {
    const now = new Date();
    switch (level) {
        case 1: return new Date(now.setDate(now.getDate() + 1)); // 1 ngày
        case 2: return new Date(now.setDate(now.getDate() + 7)); // 1 tuần
        case 3: return new Date(now.setMonth(now.getMonth() + 1)); // 1 tháng
        case 4: return new Date(now.setFullYear(now.getFullYear() + 1)); // 1 năm
        case 5: return null; // Vĩnh viễn -> không có ngày hết hạn
        default: return null;
    }
};



