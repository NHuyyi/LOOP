import React from "react";
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Nhận { data } từ props
function PointsBarChart({ data }) {
    // Đảm bảo KHÔNG CÒN mảng const pointsData = [...] nào ở trên này nữa

    if (!data || data.length === 0) return null;
    return (
        <ResponsiveContainer width="100%" height={220}>
            {/* Truyền data vào BarChart */}
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="name" tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f5f5f5' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="count" fill="#50dc9a" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}

export default PointsBarChart;