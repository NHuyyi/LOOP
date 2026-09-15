import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./GrowthChart.module.css";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const cx = classNames.bind(styles);

// Nhận object growthData từ cha
function GrowthChart({ growthData }) {
    // Bổ sung các state: 'week', 'month', 'year', 'all'
    const [timeRange, setTimeRange] = useState("week");

    // An toàn: Lấy data theo tab hiện tại, nếu không có thì trả về mảng rỗng
    const chartData = growthData ? growthData[timeRange] : [];

    return (
        <div className={cx("chart-card")}>
            <div className={cx("chart-header")}>
                <h3>Tăng trưởng tài khoản</h3>
                {/* 4 Nút Lọc Thời Gian */}
                <div className={cx("time-tags")}>
                    <button className={cx("tag", { active: timeRange === "week" })} onClick={() => setTimeRange("week")}>Tuần</button>
                    <button className={cx("tag", { active: timeRange === "month" })} onClick={() => setTimeRange("month")}>Tháng</button>
                    <button className={cx("tag", { active: timeRange === "year" })} onClick={() => setTimeRange("year")}>Năm nay</button>
                    <button className={cx("tag", { active: timeRange === "all" })} onClick={() => setTimeRange("all")}>Hàng năm</button>
                </div>
            </div>
            <div className={cx("chart-body")}>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                        <XAxis dataKey="name" tick={{ fill: '#888', fontSize: 13 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#888', fontSize: 13 }} allowDecimals={false} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                        <Line type="monotone" dataKey="users" stroke="#a259ff" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default GrowthChart;