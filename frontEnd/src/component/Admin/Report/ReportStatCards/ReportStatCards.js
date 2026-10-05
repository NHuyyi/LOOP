import React from "react";
import classNames from "classnames/bind";
import styles from "../../../../pages/Admin/ReportDashboard/ReportDashboard.module.css";
import { AlertCircle, CheckCircle, Activity } from "lucide-react";
import CategoryStatCard from "../CategoryStatCard/CategoryStatCard"; // Import thẻ thứ 4

const cx = classNames.bind(styles);

function ReportStatCards({ stats }) {
    return (
        <div className={cx("stats-grid")}>
            <div className={cx("stat-card", "primary")}>
                <div className={cx("stat-icon")}><Activity size={24} /></div>
                <div className={cx("stat-info")}>
                    <span className={cx("stat-label")}>Tổng đơn báo cáo</span>
                    <h3 className={cx("stat-value")}>{stats?.total || 0}</h3>
                </div>
            </div>

            <div className={cx("stat-card", "warning")}>
                <div className={cx("stat-icon")}><AlertCircle size={24} /></div>
                <div className={cx("stat-info")}>
                    <span className={cx("stat-label")}>Đang chờ xử lý</span>
                    <h3 className={cx("stat-value")}>{stats?.pending || 0}</h3>
                </div>
            </div>

            <div className={cx("stat-card", "success")}>
                <div className={cx("stat-icon")}><CheckCircle size={24} /></div>
                <div className={cx("stat-info")}>
                    <span className={cx("stat-label")}>Đã giải quyết</span>
                    <h3 className={cx("stat-value")}>{stats?.processed || 0}</h3>
                </div>
            </div>

            {/* Thẻ thứ 4 đã được tách riêng */}
            <CategoryStatCard stats={stats} />
        </div>
    );
}

export default ReportStatCards;