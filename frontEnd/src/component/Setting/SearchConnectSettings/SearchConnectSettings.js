import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import classNames from "classnames/bind";
import styles from "./SearchConnectSettings.module.css";
import { updatePrivacyAPI } from "../../../services/User/updatePrivacyAPI";
import { setUser } from "../../../redux/userSlice";

const cx = classNames.bind(styles);

function SearchConnectSettings() {
    const { user, token } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const [allowSearch, setAllowSearch] = useState(user?.allowSearchByCode ?? true);
    const [allowRequest, setAllowRequest] = useState(user?.allowFriendRequests ?? true);

    const handleToggleSearch = async () => {
        const newValue = !allowSearch;
        setAllowSearch(newValue);

        // CHỈ gửi trường allowSearchByCode
        const res = await updatePrivacyAPI({ allowSearchByCode: newValue });
        if (res.success) {
            dispatch(setUser({ user: res.user, token }));
        } else {
            setAllowSearch(!newValue);
            alert(res.message);
        }
    };

    const handleToggleRequest = async () => {
        const newValue = !allowRequest;
        setAllowRequest(newValue);

        // CHỈ gửi trường allowFriendRequests
        const res = await updatePrivacyAPI({ allowFriendRequests: newValue });
        if (res.success) {
            dispatch(setUser({ user: res.user, token }));
        } else {
            setAllowRequest(!newValue);
            alert(res.message);
        }
    };

    return (
        <div className={cx("container")}>
            <h3 className={cx("title")}>Tìm kiếm & Kết bạn</h3>

            <div className={cx("setting-item")}>
                <div className={cx("setting-info")}>
                    <h4>Cho phép tìm kiếm qua Friend Code</h4>
                    <p>Nếu tắt, người lạ nhập mã của bạn sẽ nhận được thông báo "Không tìm thấy".</p>
                </div>
                <label className={cx("switch")}>
                    <input type="checkbox" checked={allowSearch} onChange={handleToggleSearch} />
                    <span className={cx("slider")}></span>
                </label>
            </div>

            <div className={cx("setting-item")}>
                <div className={cx("setting-info")}>
                    <h4>Nhận yêu cầu kết bạn</h4>
                    <p>Nếu tắt, người khác vẫn có thể xem trang cá nhân nhưng không thể gửi lời mời.</p>
                </div>
                <label className={cx("switch")}>
                    <input type="checkbox" checked={allowRequest} onChange={handleToggleRequest} />
                    <span className={cx("slider")}></span>
                </label>
            </div>
        </div>
    );
}

export default SearchConnectSettings;