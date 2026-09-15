import React, { useMemo } from "react";
import classNames from "classnames/bind";
import styles from "./UserCharts.module.css";

import SummaryCards from "./SummaryCards/SummaryCards";
import GrowthChart from "./GrowthChart/GrowthChart";
import MixedStatusChart from "./MixedStatusChart/MixedStatusChart";

const cx = classNames.bind(styles);

function UserCharts({ users = [] }) {
    // Tự động tính toán các chỉ số dựa trên mảng users thật
    const stats = useMemo(() => {
        let total = users.length;
        let banned = 0;
        let unverified = 0;
        let newThisWeek = 0;

        let p0_100 = 0, p100_500 = 0, p500_1k = 0, p1k_plus = 0;

        const now = new Date();
        const currentYear = now.getFullYear();
        const fourWeeksAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);

        // --- CẤU TRÚC DỮ LIỆU CÁC MỐC THỜI GIAN ---

        // 1. TUẦN: Cố định từ Thứ 2 -> Chủ Nhật của tuần hiện tại
        const weekData = [];
        const dayNames = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

        // Tính toán tìm ngày Thứ 2 của tuần này
        const dayOfWeek = now.getDay(); // Chủ nhật là 0, Thứ 2 là 1...
        const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

        const currentMonday = new Date(now);
        currentMonday.setDate(now.getDate() - diffToMonday);
        currentMonday.setHours(0, 0, 0, 0); // Reset giờ về 00:00:00

        // Tạo mảng 7 ngày bắt đầu từ Thứ 2
        for (let i = 0; i < 7; i++) {
            const d = new Date(currentMonday);
            d.setDate(currentMonday.getDate() + i);

            weekData.push({
                name: dayNames[i], // Hiển thị "T2", "T3"... trên biểu đồ
                users: 0,
                rawDate: d.setHours(0, 0, 0, 0)
            });
        }

        // 2. THÁNG: 4 tuần qua
        const monthData = [
            { name: "Tuần 1", users: 0 }, { name: "Tuần 2", users: 0 },
            { name: "Tuần 3", users: 0 }, { name: "Tuần 4", users: 0 }
        ];

        // 3. NĂM: 12 tháng (của năm hiện tại)
        const yearData = Array.from({ length: 12 }, (_, i) => ({ name: `Th ${i + 1}`, users: 0 }));

        // 4. HÀNG NĂM: Dữ liệu qua các năm
        const allTimeMap = {};

        // --- PHÂN TÍCH DỮ LIỆU ---
        users.forEach(u => {
            // Phân loại trạng thái
            if (u.isdelete) banned++;
            else if (!u.isVerified) unverified++;

            // Phân loại điểm số
            if (u.points <= 100) p0_100++;
            else if (u.points <= 500) p100_500++;
            else if (u.points <= 1000) p500_1k++;
            else p1k_plus++;

            // XỬ LÝ THỜI GIAN
            const createdDate = new Date(u.createdAt);
            if (isNaN(createdDate)) return;

            if (createdDate >= currentMonday) newThisWeek++;

            // Dữ liệu Tuần
            const rawCreated = new Date(createdDate).setHours(0, 0, 0, 0);
            const weekItem = weekData.find(d => d.rawDate === rawCreated);
            if (weekItem) weekItem.users++;

            // Dữ liệu Tháng (4 tuần gần nhất)
            if (createdDate >= fourWeeksAgo) {
                const daysDiff = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));
                if (daysDiff < 7) monthData[3].users++;       // Gần nhất (Tuần 4)
                else if (daysDiff < 14) monthData[2].users++; // Tuần 3
                else if (daysDiff < 21) monthData[1].users++; // Tuần 2
                else if (daysDiff < 28) monthData[0].users++; // Tuần 1
            }

            // Dữ liệu Năm (12 tháng của năm nay)
            if (createdDate.getFullYear() === currentYear) {
                yearData[createdDate.getMonth()].users++;
            }

            // Dữ liệu Hàng năm (Tất cả)
            const userYear = createdDate.getFullYear().toString();
            if (!allTimeMap[userYear]) allTimeMap[userYear] = 0;
            allTimeMap[userYear]++;
        });

        // Chuyển object Hàng năm thành mảng và sắp xếp tăng dần theo năm
        const allTimeData = Object.keys(allTimeMap).sort().map(year => ({
            name: year,
            users: allTimeMap[year]
        }));

        const active = total - banned - unverified;

        return {
            summary: { total, newThisWeek, unverified, banned },
            statusData: [
                { name: "Hoạt động", value: active, color: "#50dc9a" },
                { name: "Chờ xác thực", value: unverified, color: "#ffc107" },
                { name: "Bị khóa", value: banned, color: "#ff4d4f" }
            ],
            pointsData: [
                { name: "0-100", count: p0_100 },
                { name: "100-500", count: p100_500 },
                { name: "500-1K", count: p500_1k },
                { name: "> 1K", count: p1k_plus }
            ],
            // Gom chung biểu đồ tăng trưởng vào 1 object để truyền xuống
            growthData: {
                week: weekData.map(d => ({ name: d.name, users: d.users })),
                month: monthData,
                year: yearData,
                all: allTimeData
            }
        };
    }, [users]);

    return (
        <div className={cx("charts-container")}>
            <SummaryCards data={stats.summary} />
            <div className={cx("charts-grid")}>
                {/* Truyền cục growthData mới xuống GrowthChart */}
                <GrowthChart growthData={stats.growthData} />
                <MixedStatusChart statusData={stats.statusData} pointsData={stats.pointsData} />
            </div>
        </div>
    );
}

export default UserCharts;