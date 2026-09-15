import React from "react";
import classNames from "classnames/bind";
import styles from "./UserBadge.module.css";

const cx = classNames.bind(styles);

function UserBadge({ isdelete, isVerified }) {
    if (isdelete) {
        return <span className={cx("badge", "badge-banned")}>Bị khóa</span>;
    }
    if (!isVerified) {
        return <span className={cx("badge", "badge-warning")}>Chờ xác thực</span>;
    }
    return <span className={cx("badge", "badge-active")}>Hoạt động</span>;
}

export default UserBadge;