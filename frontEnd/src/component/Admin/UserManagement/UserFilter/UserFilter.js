import React, { useState, useRef, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./UserFilter.module.css";
import { Search, Filter, ChevronDown } from "lucide-react"; // Thêm ChevronDown

const cx = classNames.bind(styles);

function UserFilter({ searchTerm, setSearchTerm, filterStatus, setFilterStatus }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Mảng cấu hình các tùy chọn lọc
    const options = [
        { value: "all", label: "Tất cả" },
        { value: "active", label: "Hoạt động" },
        { value: "banned", label: "Bị khóa" },
        { value: "unverified", label: "Chờ xác thực" },
    ];

    // Tìm label của trạng thái hiện tại để hiển thị
    const currentLabel = options.find(opt => opt.value === filterStatus)?.label || "Tất cả trạng thái";

    // Xử lý sự kiện click ra ngoài để đóng dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (value) => {
        setFilterStatus(value);
        setIsOpen(false); // Đóng menu sau khi chọn
    };

    return (
        <div className={cx("filter-container")}>
            {/* Ô tìm kiếm */}
            <div className={cx("search-box")}>
                <Search size={18} className={cx("search-icon")} />
                <input
                    type="text"
                    placeholder="Tìm theo Tên, Email hoặc FriendCode..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={cx("search-input")}
                />
            </div>

            {/* Bộ lọc trạng thái (Custom Dropdown) */}
            <div className={cx("filter-box")} ref={dropdownRef}>
                <Filter size={18} className={cx("filter-icon")} />

                {/* Nút bấm để mở Menu */}
                <div
                    className={cx("custom-select", { open: isOpen })}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span>{currentLabel}</span>
                    <ChevronDown size={16} className={cx("chevron", { rotate: isOpen })} />
                </div>

                {/* Danh sách xổ xuống */}
                {isOpen && (
                    <ul className={cx("dropdown-menu")}>
                        {options.map((opt) => (
                            <li
                                key={opt.value}
                                className={cx("dropdown-item", { selected: filterStatus === opt.value })}
                                onClick={() => handleSelect(opt.value)}
                            >
                                {opt.label}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default UserFilter;