import React from "react";
import classNames from "classnames/bind";
import styles from "./UserTable.module.css";
import UserRow from "../UserRow/UserRow";

const cx = classNames.bind(styles);

function UserTable({ users }) {
    if (!users || users.length === 0) {
        return (
            <div className={cx("empty-state")}>
                Không có dữ liệu người dùng
            </div>
        );
    }

    return (
        <div className={cx("table-responsive")}>
            <table className={cx("user-table")}>
                <thead>
                    <tr>
                        <th>Người dùng</th>
                        <th>FriendCode</th>
                        <th>Email</th>
                        <th>Điểm số</th>
                        <th>Trạng thái</th>
                        <th className={cx("text-center")}>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <UserRow key={user.id} user={user} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserTable;