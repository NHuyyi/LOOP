import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import classNames from "classnames/bind";
import styles from "./TwoFactorSettings.module.css";
import { updatePrivacyAPI } from "../../../services/User/updatePrivacyAPI";
import { setUser } from "../../../redux/userSlice";
import { ShieldCheck } from "lucide-react";

const cx = classNames.bind(styles);

function TwoFactorSettings() {
    const { user, token } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const [is2FA, setIs2FA] = useState(user?.twoFactorEnabled ?? false);

    const handleToggle2FA = async () => {
        const newValue = !is2FA;
        setIs2FA(newValue);

        const res = await updatePrivacyAPI({ twoFactorEnabled: newValue });
        if (res.success) {
            dispatch(setUser({ user: res.user, token }));
        } else {
            setIs2FA(!newValue);
            alert(res.message);
        }
    };

    return (
        <div className={cx("container")}>
            <h3 className={cx("title")}>Xác thực 2 bước (2FA)</h3>

            <div className={cx("security-shield")}>
                <ShieldCheck size={24} />
                <span>Thêm một lớp bảo vệ bổ sung cho tài khoản của bạn.</span>
            </div>

            <div className={cx("setting-item")}>
                <div className={cx("setting-info")}>
                    <h4>Bảo vệ qua Email OTP</h4>
                    <p>
                        Khi bật, bạn sẽ cần nhập mã OTP được gửi về Email <b>{user?.email}</b> mỗi khi đăng nhập trên thiết bị mới.
                    </p>
                </div>
                <label className={cx("switch")}>
                    <input type="checkbox" checked={is2FA} onChange={handleToggle2FA} />
                    <span className={cx("slider")}></span>
                </label>
            </div>
        </div>
    );
}

export default TwoFactorSettings;