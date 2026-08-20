import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./DeviceManagement.module.css";
import { Monitor, Smartphone, Globe, LogOut, MapPin } from "lucide-react";
import { getActiveSessions } from "../../../services/Session/getActiveSessions";
import { revokeSession } from "../../../services/Session/revokeSession";
import Loading from "../../Loading/Loading";

const cx = classNames.bind(styles);

function DeviceManagement() {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    // States dùng cho thông báo
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState("");
    const [fadeOut, setFadeOut] = useState(false);

    const currentDeviceId = localStorage.getItem("deviceId");

    // Hiệu ứng tự động tắt thông báo sau 3s
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setFadeOut(true);
            }, 2500);
            const removeTimer = setTimeout(() => {
                setMessage("");
                setFadeOut(false);
            }, 3000);
            return () => {
                clearTimeout(timer);
                clearTimeout(removeTimer);
            };
        }
    }, [message]);

    useEffect(() => {
        fetchDevices();
    }, []);

    const fetchDevices = async () => {
        setLoading(true);
        const res = await getActiveSessions();
        if (res.success) {
            setDevices(res.data);
        } else {
            setMessage(res.message || "Không thể tải danh sách thiết bị");
            setSuccess(false);
        }
        setLoading(false);
    };

    const handleRevoke = async (sessionId) => {
        setProcessingId(sessionId);
        const res = await revokeSession(sessionId);
        setProcessingId(null);

        if (res.success) {
            setMessage("Đã đăng xuất thiết bị thành công");
            setSuccess(true);
            setDevices((prev) => prev.filter((d) => d._id !== sessionId));
        } else {
            setMessage(res.message || "Lỗi khi đăng xuất thiết bị");
            setSuccess(false);
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

            {/* Khối hiển thị thông báo */}
            {message && (
                <div
                    className={`${cx("app-message")}
                        ${success === false ? cx("app-message__err") : cx("app-message__ok")} 
                        ${fadeOut ? cx("fade-out") : ""}`}
                >
                    {message}
                </div>
            )}
        </div>
    );
}

export default DeviceManagement;