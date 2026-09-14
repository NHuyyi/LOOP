import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Bell, X } from "lucide-react"; // Thêm icon X để đóng
import classNames from "classnames/bind";
import styles from "./NotificationDropdown.module.css";
import { markSingleAsRead } from "../../../redux/notificationSlice";
import { markNotificationsAsReadAPI } from "../../../services/notifications/markNotificationsAsRead";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const dropdownRef = useRef(null); // Ref để bắt sự kiện click outside

    const { items = [], unreadCount = 0 } = useSelector((state) => state.notification || {});

    // Bắt sự kiện Click ra ngoài vùng dropdown để đóng
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const handleNotiClick = async (noti) => {
        // 1. Nếu chưa đọc thì đánh dấu đã đọc 1 cái này thôi
        if (!noti.isRead) {
            dispatch(markSingleAsRead(noti._id)); // Đổi state Redux ngay lập tức
            await markNotificationsAsReadAPI(noti._id); // Gọi API ngầm
        }

        // 2. Chuyển hướng
        if (noti.url) {
            navigate(noti.url);
        }
        setIsOpen(false); // Đóng dropdown
    };

    const getActionText = (type) => {
        switch (type) {
            case "comment": return "đã bình luận về bài viết của bạn.";
            case "reaction": return "đã bày tỏ cảm xúc về bài viết của bạn.";
            case "friend_request": return "đã gửi cho bạn một lời mời kết bạn.";
            case "friend_accept": return "đã chấp nhận lời mời kết bạn của bạn.";
            default: return "đã tương tác với bạn.";
        }
    };

    return (
        <div className={cx("noti-wrapper")} ref={dropdownRef}>
            {/* Nút Chuông */}
            <button
                className={cx("bell-btn", { active: isOpen })}
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bell size={22} strokeWidth={2.5} color={isOpen ? "#a259ff" : "#333"} />
                {unreadCount > 0 && <span className={cx("badge")}>{unreadCount > 99 ? '99+' : unreadCount}</span>}
            </button>

            {/* Popup Dropdown */}
            {isOpen && (
                <div className={cx("dropdown")}>
                    <div className={cx("dropdown-header")}>
                        <h4 className={cx("dropdown-title")}>Thông báo</h4>
                        <button className={cx("close-btn")} onClick={() => setIsOpen(false)}>
                            <X size={20} />
                        </button>
                    </div>

                    <div className={cx("noti-list")}>
                        {items.length > 0 ? (
                            items.map((noti) => (
                                <div
                                    key={noti._id}
                                    className={cx("noti-item", { unread: !noti.isRead })}
                                    onClick={() => handleNotiClick(noti)}
                                >
                                    <img src={noti.sender?.avatar} alt="avatar" className={cx("avatar")} />

                                    {/* Nội dung chia làm 2 dòng, có hover effect */}
                                    <div className={cx("content-wrapper")}>
                                        <span className={cx("sender-name")}>{noti.sender?.name || "Người dùng ẩn danh"}</span>
                                        <span className={cx("action-text")}>{getActionText(noti.type)}</span>
                                    </div>

                                    {/* Chấm xanh hiển thị chưa đọc */}
                                    {!noti.isRead && <div className={cx("unread-dot")}></div>}
                                </div>
                            ))
                        ) : (
                            <div className={cx("empty-state")}>
                                <Bell size={40} className={cx("empty-icon")} />
                                <p>Bạn không có thông báo nào.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default NotificationDropdown;