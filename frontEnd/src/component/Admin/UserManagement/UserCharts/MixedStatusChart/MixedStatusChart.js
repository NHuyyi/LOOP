import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./MixedStatusChart.module.css";
import StatusPieChart from "./StatusPieChart";
import PointsBarChart from "./PointsBarChart";

const cx = classNames.bind(styles);

function MixedStatusChart({ statusData, pointsData }) {
    const [rightTab, setRightTab] = useState("status"); // status, points

    return (
        <div className={cx("chart-card")}>
            <div className={cx("tabs-header")}>
                <button className={cx("tab", { active: rightTab === "status" })} onClick={() => setRightTab("status")}>Trạng thái</button>
                <button className={cx("tab", { active: rightTab === "points" })} onClick={() => setRightTab("points")}>Điểm số</button>
            </div>

            <div className={cx("chart-body", "center-content")}>
                {rightTab === "status"
                    ? <StatusPieChart cx={cx} data={statusData} />
                    : <PointsBarChart data={pointsData} />
                }
            </div>
        </div>
    );
}

export default MixedStatusChart;