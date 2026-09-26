import React from "react";
import classNames from "classnames/bind";
import styles from "./ReportTable.module.css";
import ReportRow from "../ReportRow/ReportRow";
import { ChevronLeft, ChevronRight } from "lucide-react";

const cx = classNames.bind(styles);

function ReportTable({ reports, openBanModal, page, totalPages, onPageChange }) {
    if (!reports || reports.length === 0) {
        return (
            <div className={cx("empty-state")}>
                Không có đơn tố cáo nào phù hợp.
            </div>
        );
    }

    return (
        <div className={cx("table-container")}>
            <div className={cx("table-responsive")}>
                <table className={cx("report-table")}>
                    <thead>
                        <tr>
                            <th>Người tố cáo</th>
                            <th>Người bị tố cáo</th>
                            <th>Lý do vi phạm</th>
                            <th>Thời gian</th>
                            <th>Trạng thái</th>
                            <th className={cx("text-center")}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report) => (
                            <ReportRow
                                key={report._id}
                                report={report}
                                openBanModal={openBanModal}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className={cx("pagination")}>
                    <button
                        className={cx("page-btn")}
                        disabled={page <= 1}
                        onClick={() => onPageChange(page - 1)}
                    >
                        <ChevronLeft size={16} /> Trước
                    </button>
                    <span className={cx("page-info")}>
                        Trang {page} / {totalPages}
                    </span>
                    <button
                        className={cx("page-btn")}
                        disabled={page >= totalPages}
                        onClick={() => onPageChange(page + 1)}
                    >
                        Sau <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}

export default ReportTable;