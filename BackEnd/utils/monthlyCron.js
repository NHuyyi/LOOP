const cron = require("node-cron");
const UserStreak = require("../model/UserStreak.Model");
const User = require("../model/User.Model");

// Chạy vào 00:00 ngày 1 hàng tháng
const startMonthlyCron = () => {
    cron.schedule("0 0 1 * *", async () => {
        console.log("Bắt đầu tổng kết xếp hạng tháng...");

        try {
            // 1. Lấy tất cả streak, sắp xếp điểm tháng giảm dần
            const streaks = await UserStreak.find().sort({ monthlyPoints: -1 });

            // 2. Duyệt qua từng user để trao thưởng
            for (let i = 0; i < streaks.length; i++) {
                const streak = streaks[i];
                let rewardCoins = 0;

                // Cơ cấu giải thưởng (bạn có thể tự chỉnh)
                if (i === 0) rewardCoins = 5000; // Top 1
                else if (i === 1) rewardCoins = 3000; // Top 2
                else if (i === 2) rewardCoins = 2000; // Top 3
                else if (i < 10) rewardCoins = 1000; // Top 4 - 10
                else if (streak.monthlyPoints > 0) rewardCoins = 100; // Có tham gia

                if (rewardCoins > 0) {
                    // Cộng Ngân khố cho User
                    await User.findByIdAndUpdate(streak.userId, {
                        $inc: { coins: rewardCoins }
                    });
                }

                // 3. Reset điểm tháng về 0
                streak.monthlyPoints = 0;
                await streak.save();
            }

            console.log("Hoàn tất trao thưởng và reset tháng!");
        } catch (error) {
            console.error("Lỗi khi chạy cronjob:", error);
        }
    });
};

module.exports = startMonthlyCron;