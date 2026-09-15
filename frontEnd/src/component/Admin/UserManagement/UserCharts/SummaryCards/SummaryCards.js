import React from "react";
import classNames from "classnames/bind";
import styles from "./SummaryCards.module.css";
import { Users, UserPlus, UserX, AlertTriangle } from "lucide-react";

const cx = classNames.bind(styles);

function SummaryCards({ data }) {
    if (!data) return null;
    return (
        <div className={cx("summary-cards")}>
            <div className={cx("card-item")}>
                <div className={cx("card-icon", "blue")}><Users size={24} /></div>
                <div className={cx("card-info")}>
                    <p>Tổng User</p>
                    <h3>{data.total.toLocaleString()}</h3>
                </div>
            </div>
            <div className={cx("card-item")}>
                <div className={cx("card-icon", "green")}><UserPlus size={24} /></div>
                <div className={cx("card-info")}>
                    <p>Mới tuần này</p>
                    <h3>+{data.newThisWeek.toLocaleString()}</h3>
                </div>
            </div>
            <div className={cx("card-item")}>
                <div className={cx("card-icon", "yellow")}><AlertTriangle size={24} /></div>
                <div className={cx("card-info")}>
                    <p>Chờ xác thực</p>
                    <h3>{data.unverified.toLocaleString()}</h3>
                </div>
            </div>
            <div className={cx("card-item")}>
                <div className={cx("card-icon", "red")}><UserX size={24} /></div>
                <div className={cx("card-info")}>
                    <p>Đang bị khóa</p>
                    <h3>{data.banned.toLocaleString()}</h3>
                </div>
            </div>
        </div>
    );
}
export default SummaryCards;