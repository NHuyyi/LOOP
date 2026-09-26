import React from "react";
import classNames from "classnames/bind";
import styles from "../../../../pages/Admin/ReportDashboard/ReportDashboard.module.css";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const cx = classNames.bind(styles);

const LABEL_CONFIG = {
    spam: { name: "Spam / Tin rác", color: "#fcc419" },
    harassment: { name: "Quấy rối", color: "#ff6b6b" },
    hate_speech: { name: "Ngôn từ thù ghét", color: "#e03131" },
    inappropriate_content: { name: "Phản cảm", color: "#d0bfff" },
    other: { name: "Khác", color: "#adb5bd" }
};

function ReportPieChart({ data = [] }) {
    const chartData = data.map(item => ({
        name: LABEL_CONFIG[item._id]?.name || item._id,
        value: item.count,
        color: LABEL_CONFIG[item._id]?.color || "#868e96"
    }));

    if (!chartData || chartData.length === 0) {
        return (
            <div className={cx("chart-container", "empty-chart")}>
                <p>Chưa có dữ liệu thống kê vi phạm</p>
            </div>
        );
    }

    return (
        <div className={cx("chart-container")}>
            <h3 className={cx("chart-title")}>Tỷ lệ các loại vi phạm</h3>
            <div className={cx("chart-wrapper")}>
                <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={0}
                            outerRadius={100}
                            paddingAngle={1}
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value) => [`${value} đơn`, "Số lượng"]}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default ReportPieChart;