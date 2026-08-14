import React from "react";
import classNames from "classnames/bind";
import styles from "./SettingsContent.module.css";

// Import các component đã có sẵn từ source của bạn
import BasicInfoForm from "../../EditProfile/BasicInfoForm/BasicInfoForm";
import ChangePasswordForm from "../../EditProfile/ChangePasswordForm/ChangePasswordForm";
import BlockedUsersList from "../../chat/ChatSidebar/Blocklist/BlockedUsersList";
import RestrictedList from "../../chat/ChatSidebar/RestrictedList/RestrictedList";

const cx = classNames.bind(styles);

function SettingsContent({ activeTab }) {
    const renderContent = () => {
        switch (activeTab) {
            // Nhóm hoàn thiện
            case "edit_basic_info":
                return <BasicInfoForm />;
            case "password":
                return <ChangePasswordForm />;
            case "blocked_users":
                return <BlockedUsersList />;
            case "restricted_users":
                return <RestrictedList />;

            // Nhóm Giai đoạn 2 & 3
            case "search_connect":
                return <div>Tìm kiếm & Kết bạn</div>;
            case "active_status":
                return <div>Trạng thái hoạt động</div>;
            case "post_visibility":
                return <div>Quyền riêng tư bài viết mặc định</div>;
            case "message_sound":
                return <div>Cài đặt Âm thanh tin nhắn</div>;
            case "push_notifications":
                return <div>Cài đặt Thông báo đẩy</div>;
            case "device_management":
                return <div>Quản lý thiết bị đăng nhập</div>;
            case "two_factor":
                return <div>Xác thực 2 lớp (2FA)</div>;
            case "delete_account":
                return <div>Vô hiệu hoá / Xóa tài khoản</div>;
            case "theme":
                return <div>Chế độ Sáng/Tối</div>;
            case "language":
                return <div>Ngôn ngữ</div>;
            default:
                return <BasicInfoForm />;
        }
    };

    return (
        <div className={cx("content-area")}>
            {renderContent()}
        </div>
    );
}

export default SettingsContent;