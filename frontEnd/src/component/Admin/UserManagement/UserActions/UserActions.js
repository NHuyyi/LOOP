import React from "react";
import classNames from "classnames/bind";
import styles from "./UserActions.module.css";
import { Lock, Unlock, MessageSquare, Trash2 } from "lucide-react";

const cx = classNames.bind(styles);

function UserActions({ user }) {
    // Các hàm xử lý click sẽ được gắn vào sau
    return (
        <div className={cx("actions")}>
            <button className={cx("action-btn", "msg-btn")} title="Nhắn tin">
                <MessageSquare size={16} />
            </button>

            {user.isdelete ? (
                <button className={cx("action-btn", "unlock-btn")} title="Mở khóa">
                    <Unlock size={16} />
                </button>
            ) : (
                <button className={cx("action-btn", "lock-btn")} title="Khóa tài khoản">
                    <Lock size={16} />
                </button>
            )}

            <button className={cx("action-btn", "delete-btn")} title="Xóa vĩnh viễn">
                <Trash2 size={16} />
            </button>
        </div>
    );
}

export default UserActions;