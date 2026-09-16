import React from "react";
import classNames from "classnames/bind";
import styles from "./UserRow.module.css";
import UserBadge from "../UserBadge/UserBadge";
import UserActions from "../UserActions/UserActions";

const cx = classNames.bind(styles);

function UserRow({ user, openDeleteModal }) {
    return (
        <tr className={cx("user-row")}>
            <td>
                <div className={cx("user-info")}>
                    <img src={user.avatar} alt={user.name} className={cx("avatar")} />
                    <span className={cx("name")}>{user.name}</span>
                </div>
            </td>
            <td className={cx("code")}>{user.friendCode}</td>
            <td className={cx("email")}>{user.email}</td>
            <td className={cx("points")}>{user.points?.toLocaleString()}</td>
            <td>
                <UserBadge isdelete={user.isdelete} isVerified={user.isVerified} />
            </td>
            <td>
                <UserActions user={user} openDeleteModal={openDeleteModal} />
            </td>
        </tr>
    );
}

export default UserRow;