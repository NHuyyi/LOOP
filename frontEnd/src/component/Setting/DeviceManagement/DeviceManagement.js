import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./DeviceManagement.module.css";
import { Monitor, Smartphone, Globe, LogOut, MapPin } from "lucide-react";
import { getActiveSessions } from "../../../services/Session/getActiveSessions";
import { revokeSession } from "../../../services/Session/revokeSession";
import Loading from "../../Loading/Loading";
import { useToast } from "../../../context/ToastContext";

const cx = classNames.bind(styles);

function DeviceManagement() {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const Toast = useToast();

    const currentDeviceId = localStorage.getItem("deviceId");


    useEffect(() => {
        fetchDevices();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchDevices = async () => {
        setLoading(true);
        const res = await getActiveSessions();
        if (res.success) {
            setDevices(res.data);
        } else {
            Toast.error("Không thể tải danh sách thiết bị");
        }
        setLoading(false);
    };

    const handleRevoke = async (sessionId) => {
        setProcessingId(sessionId);
        const res = await revokeSession(sessionId);
        setProcessingId(null);

        if (res.success) {
            Toast.success("Đã đăng xuất thiết bị thành công");
            setDevices((prev) => prev.filter((d) => d._id !== sessionId));
        } else {
            Toast.error("Lỗi khi đăng xuất thiết bị");
        }
    };

    const getDeviceIcon = (deviceName) => {
        const isDesktop = deviceName?.toLowerCase().includes("mac") || deviceName?.toLowerCase().includes("windows");
        return isDesktop ? <Monitor size={24} className={cx("device-icon")} /> : <Smartphone size={24} className={cx("device-icon")} />;
    };

    return (
        <div className={cx("container")}>
            <h3 className={cx("title")}>Quản lý thiết bị</h3>
            <p className={cx("subtitle")}>Các thiết bị đang đăng nhập vào tài khoản của bạn.</p>

            {loading ? (
                <Loading text="Đang tải dữ liệu..." />
            ) : (
                <div className={cx("device-list")}>
                    {devices.map((device) => {
                        const isCurrentDevice = device.deviceId === currentDeviceId;
                        const date = new Date(device.lastActiveAt).toLocaleString("vi-VN");

                        return (
                            <div key={device._id} className={cx("device-item")}>
                                <div className={cx("device-info")}>
                                    {getDeviceIcon(device.deviceName)}
                                    <div className={cx("device-details")}>
                                        <h4 className={cx("device-name")}>
                                            {device.deviceName} - {device.browserName}
                                            {isCurrentDevice && <span className={cx("current-badge")}>Đang dùng</span>}
                                        </h4>

                                        <span className={cx("device-id")} title="Device ID">ID: {device.deviceId}</span>
                                        <div className={cx("device-meta")}>
                                            <span className={cx("meta-item")} title="Vị trí"><MapPin size={14} /> {device.location}</span>
                                            <span className={cx("meta-item")} title="IP"><Globe size={14} /> {device.ipAddress}</span>
                                        </div>
                                        <span className={cx("last-active")}>Hoạt động cuối: {date}</span>
                                    </div>
                                </div>
                                {!isCurrentDevice && (
                                    <button
                                        className={cx("revoke-btn")}
                                        onClick={() => handleRevoke(device._id)}
                                        disabled={processingId === device._id}
                                    >
                                        {processingId === device._id ? (
                                            <Loading size="small" />
                                        ) : (
                                            <>
                                                <LogOut size={18} />
                                                <span>Đăng xuất</span>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        );
                    })}
                    {devices.length === 0 && <p className={cx("empty-text")}>Không có dữ liệu thiết bị.</p>}
                </div>
            )}
        </div>
    );
}

export default DeviceManagement;