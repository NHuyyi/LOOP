exports.determineNextPenaltyLevel = (currentPenalty) => {
    // Nếu chưa từng bị phạt -> Áp dụng Level 1
    if (!currentPenalty || currentPenalty.penaltyLevel === 0) return 1;

    const now = new Date();
    const lastUnbannedAt = currentPenalty.lastUnbannedAt;

    // KHOAN HỒNG: Nếu đã từng bị khóa, kiểm tra xem đã qua 1 tuần kể từ lúc được thả chưa
    if (lastUnbannedAt) {
        const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
        if (now.getTime() - lastUnbannedAt.getTime() > oneWeekMs) {
            // Đã qua 1 tuần không dính phốt -> Xóa án tích, tính lại từ đầu (Level 1)
            return 1;
        }
    }

    // TĂNG HÌNH PHẠT: Chưa qua 1 tuần mà đã bị 5 report -> Nâng cấp độ
    const nextLevel = currentPenalty.penaltyLevel + 1;

    // Khóa kịch trần là Level 5
    return nextLevel > 5 ? 5 : nextLevel;
};