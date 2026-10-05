import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "../../../../pages/Admin/ReportDashboard/ReportDashboard.module.css";
import { ShieldAlert } from "lucide-react";
import ReportCustomSelect from "../ReportCustomSelect/ReportCustomSelect"; // Import dropdown mới

const cx = classNames.bind(styles);

function CategoryStatCard({ stats }) {
    // Mặc định hiển thị thống kê của Spam
    const [selectedLabel, setSelectedLabel] = useState("spam");

    const labelOptions = [
        { value: "spam", label: "Spam / Tin rác" },
        { value: "harassment", label: "Quấy rối" },
        { value: "hate_speech", label: "Thù ghét" },
        { value: "inappropriate_content", label: "Phản cảm" },
        { value: "other", label: "Khác" }
    ];

    // Lọc số lượng từ dữ liệu Backend trả về
    const selectedCount = stats?.byLabels?.find(item => item._id === selectedLabel)?.count || 0;

    return (
        // Thêm overflow: "visible" để menu thả xuống không bị cắt mất
        <div className={cx("stat-card", "danger")} style={{ overflow: "visible" }}>
            <div className={cx("stat-icon")}><ShieldAlert size={24} /></div>
            <div className={cx("stat-info")} style={{ flex: 1 }}>
                
                <div style={{ marginBottom: "6px" }}>
                    <ReportCustomSelect 
                        options={labelOptions}
                        value={selectedLabel}
                        onChange={setSelectedLabel}
                    />
                </div>
                
                <h3 className={cx("stat-value")}>{selectedCount}</h3>
            </div>
        </div>
    );
}

export default CategoryStatCard;