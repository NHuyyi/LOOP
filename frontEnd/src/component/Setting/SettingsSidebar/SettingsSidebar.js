import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./SettingsSidebar.module.css";
import LogoutAction from "../LogoutAction/LogoutAction";
import { User, Shield, Bell, Monitor, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate để chuyển trang

const cx = classNames.bind(styles);

const MENU_CATEGORIES = [
    {
        id: "account",
        title: "Tài khoản & Bảo mật",
        icon: <User size={18} />,
        items: [
            { id: "my_profile", label: "Thông tin cơ bản", isLink: true, path: "/profile" },
            { id: "edit_basic_info", label: "Chỉnh sửa thông tin cơ bản" },
            { id: "password", label: "Đổi mật khẩu" },
            { id: "device_management", label: "Quản lý thiết bị" },
            { id: "two_factor", label: "Xác thực 2 lớp (2FA)" },
            { id: "delete_account", label: "Vô hiệu hoá / Xoá" },
        ],
    },
    {
        id: "privacy",
        title: "Quyền riêng tư",
        icon: <Shield size={18} />,
        items: [
            { id: "blocked_users", label: "Danh sách chặn" },
            { id: "restricted_users", label: "Danh sách hạn chế" },
            { id: "search_connect", label: "Tìm kiếm & Kết bạn" },
            { id: "active_status", label: "Trạng thái hoạt động" },
            { id: "post_visibility", label: "Quyền riêng tư bài viết" },
        ],
    },
    {
        id: "notifications",
        title: "Thông báo",
        icon: <Bell size={18} />,
        items: [
            { id: "message_sound", label: "Âm thanh tin nhắn" },
            { id: "push_notifications", label: "Thông báo đẩy" },
        ],
    },
    {
        id: "display",
        title: "Giao diện",
        icon: <Monitor size={18} />,
        items: [
            { id: "theme", label: "Chế độ Sáng/Tối" },
            { id: "language", label: "Ngôn ngữ" },
        ],
    },
];

function SettingsSidebar({ activeTab, setActiveTab }) {
    const [openCats, setOpenCats] = useState({
        account: true,
        privacy: true,
        notifications: true,
        display: true
    });
    const navigate = useNavigate(); // Khởi tạo hàm chuyển hướng

    const toggleCategory = (catId) => {
        setOpenCats((prev) => ({ ...prev, [catId]: !prev[catId] }));
    };

    return (
        <div className={cx("sidebar")}>
            <h2 className={cx("title")}>Cài đặt</h2>

            <div className={cx("menu-scroll-area")}>
                {MENU_CATEGORIES.map((cat) => (
                    <div key={cat.id} className={cx("category-group")}>
                        <div
                            className={cx("category-header")}
                            onClick={() => toggleCategory(cat.id)}
                        >
                            <div className={cx("category-title")}>
                                {cat.icon}
                                <span>{cat.title}</span>
                            </div>
                            {openCats[cat.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>

                        {openCats[cat.id] && (
                            <ul className={cx("menu-list")}>
                                {cat.items.map((item) => (
                                    <li
                                        key={item.id}
                                        className={cx("menu-item", { active: activeTab === item.id })}
                                        onClick={() => {
                                            // Nếu là link chuyển trang, điều hướng đi. Nếu không thì đổi tab content
                                            if (item.isLink) {
                                                navigate(item.path);
                                            } else {
                                                setActiveTab(item.id);
                                            }
                                        }}
                                    >
                                        {item.label}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>

            <div className={cx("logout-wrapper")}>
                <LogoutAction />
            </div>
        </div>
    );
}

export default SettingsSidebar;