import { useState, useEffect, useCallback } from "react";
import { useToast } from "../../context/ToastContext";
import { getAllReports } from "../../services/admin/getAllReports";

export const useFetchReports = () => {
    const toast = useToast();

    const [reports, setReports] = useState([]);
    const [dashboardStats, setDashboardStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [statusFilter, setStatusFilter] = useState("");
    const [totalPages, setTotalPages] = useState(1);

    const fetchReports = useCallback(async () => {
        setLoading(true);
        const res = await getAllReports(page, limit, statusFilter);

        if (res && res.success) {
            setReports(res.data);
            setTotalPages(res.pagination.totalPages);
            setDashboardStats(res.dashboardStats);
        } else {
            toast.error(res?.message || "Không thể tải danh sách báo cáo!");
        }
        setLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, limit, statusFilter]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const handleFilterChange = (newStatus) => {
        setStatusFilter(newStatus);
        setPage(1);
    };

    return {
        reports,
        loading,
        page,
        totalPages,
        statusFilter,
        dashboardStats,
        handlePageChange,
        handleFilterChange,
        refreshReports: fetchReports
    };
};