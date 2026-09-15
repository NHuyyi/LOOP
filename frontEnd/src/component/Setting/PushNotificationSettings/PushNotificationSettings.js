import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import classNames from "classnames/bind";
import styles from "../ActiveStatusSettings/ActiveStatusSettings.module.css"; // Dùng chung CSS cho tiện
import { updateSettingsSounds } from "../../../services/notifications/updateNotiSettings";
import { setNotiSettings } from "../../../redux/userSlice";
import { useToast } from "../../../context/ToastContext";

const cx = classNames.bind(styles);

function PushNotificationSettings() {
    // Lấy thông tin cài đặt hiện tại từ Redux
    const settings = useSelector((state) => state.user.notificationSettings);
    const dispatch = useDispatch();
    const toast = useToast();

    // Lấy giá trị pushEnabled (nếu chưa có thì mặc định là true)
    const [pushEnabled, setPushEnabled] = useState(settings?.pushEnabled ?? true);

    const handleTogglePush = async () => {
        const newValue = !pushEnabled;
        setPushEnabled(newValue);

        // 1. Cập nhật lên Backend (Dùng API updateSettings hiện có)
        const res = await updateSettingsSounds({ pushEnabled: newValue });

        if (res.success) {
            // 2. Cập nhật lại Redux để HomePage nhận được sự thay đổi
            dispatch(setNotiSettings(res.data));
        } else {
            // Revert nếu lỗi
            setPushEnabled(!newValue);
            toast.error(res.message || "Lỗi khi cập nhật");
        }
    };

    return (
        <div className={cx("container")}>
            <h3 className={cx("title")}>Thông báo đẩy</h3>
            <div className={cx("setting-item")}>
                <div className={cx("setting-info")}>
                    <h4>Nhận thông báo ngoài ứng dụng</h4>
                    <p>
                        Cho phép Loop gửi thông báo tin nhắn và hoạt động ngay cả khi bạn
                        đã thu nhỏ trình duyệt hoặc đóng trang web.
                    </p>
                </div>
                <label className={cx("switch")}>
                    <input
                        type="checkbox"
                        checked={pushEnabled}
                        onChange={handleTogglePush}
                    />
                    <span className={cx("slider")}></span>
                </label>
            </div>
        </div>
    );
}

export default PushNotificationSettings;