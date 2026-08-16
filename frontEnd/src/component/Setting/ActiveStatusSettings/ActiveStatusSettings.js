import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import classNames from "classnames/bind";
import styles from "./ActiveStatusSettings.module.css";
import { updatePrivacyAPI } from "../../../services/User/updatePrivacyAPI";
import { setUser } from "../../../redux/userSlice";
import socket from "../../../socker";

const cx = classNames.bind(styles);

function ActiveStatusSettings() {
    const { user, token } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const [showActive, setShowActive] = useState(user?.showActiveStatus ?? true);

    const handleToggleActiveStatus = async () => {
        const newValue = !showActive;
        setShowActive(newValue);

        // Gọi API đã làm ở tính năng kết bạn
        const res = await updatePrivacyAPI({ showActiveStatus: newValue });
        if (res.success) {
            dispatch(setUser({ user: res.user, token }));

            // Ra lệnh cho Frontend socket bắn sự kiện lên Backend socket
            socket.emit("force-update-online");

        } else {
            setShowActive(!newValue);
            alert(res.message);
        }
    };

    return (
        <div className={cx("container")}>
            <h3 className={cx("title")}>Trạng thái hoạt động</h3>

            <div className={cx("setting-item")}>
                <div className={cx("setting-info")}>
                    <h4>Hiển thị trạng thái hoạt động</h4>
                    <p>
                        Bạn bè sẽ thấy dấu chấm <span className={cx("highlight")}>xanh lá cây</span> khi bạn online.
                        Nếu bạn tắt, bạn sẽ vào <b>Chế độ tàng hình</b> (người khác không thấy bạn, nhưng bạn vẫn thấy họ).
                    </p>
                </div>
                <label className={cx("switch")}>
                    <input type="checkbox" checked={showActive} onChange={handleToggleActiveStatus} />
                    <span className={cx("slider")}></span>
                </label>
            </div>
        </div>
    );
}

export default ActiveStatusSettings;