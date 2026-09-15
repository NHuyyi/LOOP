import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// Đã xóa mảng statusData cũ (mock data)
// Thêm prop "data" vào để lấy dữ liệu do MixedStatusChart truyền vào
function StatusPieChart({ cx, data }) {
    if (!data) return null;

    return (
        <>
            <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                    <Pie data={data} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                </PieChart>
            </ResponsiveContainer>
            <div className={cx("custom-legend")}>
                {data.map((item, i) => (
                    <div key={i} className={cx("legend-item")}>
                        <span className={cx("dot")} style={{ backgroundColor: item.color }}></span>
                        <span>{item.name}</span>
                    </div>
                ))}
            </div>
        </>
    );
}

export default StatusPieChart;