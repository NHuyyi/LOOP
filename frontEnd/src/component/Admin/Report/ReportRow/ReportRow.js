import React from "react";
import classNames from "classnames/bind";
import styles from "../ReportTable/ReportTable.module.css";
import { Clock, XCircle, Lock, Eye } from "lucide-react";


const cx = classNames.bind(styles);

function ReportRow({ report, openBanModal }) {
    const translateReason = (label) => {
        const reasons = {
            spam: "Spam / Tin rác",
            harassment: "Quấy rối",
            hate_speech: "Ngôn từ thù ghét",
            inappropriate_content: "Nội dung phản cảm",
            other: "Lý do khác"
        };
        return reasons[label] || label;
    };



    const renderStatus = (report) => {
        if (report.status === "pending") {
            return (
                <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#f59f00", fontWeight: 500 }}>
                    <Clock size={16} /> Đang chờ
                </span>
            );
        }

        if (report.status === "processed") {
            // Đã xử lý: Bị bác bỏ -> Dấu X đỏ
            if (report.actionTaken === "rejected") {
                return (
                    <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#e03131", fontWeight: 500 }}>
                        <XCircle size={16} /> Đã bác bỏ
                    </span>
                );
            }

            // Đã xử lý: Khóa tài khoản -> Ổ khóa xanh
            if (report.actionTaken === "banned") {
                return (
                    <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#2b8a3e", fontWeight: 500 }}>
                        <Lock size={16} /> Đã xử lý
                    </span>
                );
            }

        }
    };

    return (
        <tr className={cx("report-row")}>
            <td>
                <div className={cx("user-info")}>
                    <span className={cx("name")}>{report.reporter?.name}</span>
                    <span className={cx("email")}>{report.reporter?.email}</span>
                </div>
            </td>
            <td>
                <div className={cx("user-info")}>
                    <span className={cx("name", "highlight-name")}>{report.reportedUser?.name}</span>
                    <span className={cx("email")}>{report.reportedUser?.email}</span>
                </div>
            </td>
            <td className={cx("reason")}>{translateReason(report.reasonLabel)}</td>
            <td className={cx("date")}>
                {new Date(report.createdAt).toLocaleDateString("vi-VN", {
                    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
                })}
            </td>
            <td>
                <span className={cx("status-badge", report.status)}>
                    {report.status === "pending" ? "Đang chờ" : "Đã xử lý"}
                </span>
            </td>
            <td className={cx("actions")}>
                {report.status === "pending" ? (
                    <button
                        className={cx("action-btn")} style={{ background: "#e7f5ff", color: "#1971c2", border: "1px solid #a5d8ff" }}
                        onClick={() => openBanModal(report)} // Ở Dashboard ta sẽ hứng event này để mở Modal Detail
                    >
                        <Eye size={16} /> Xem chi tiết
                    </button>
                ) : (
                    renderStatus(report)
                )}
            </td>
        </tr>
    );
}

export default ReportRow;