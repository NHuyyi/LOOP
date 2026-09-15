import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../../redux/userSlice";
import { Flag, Users, MessageSquare, LogOut, ShieldCheck } from "lucide-react";
import classNames from "classnames/bind";
import styles from "./AdminHeader.module.css";

const cx = classNames.bind(styles);

function AdminHeader() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.user.user);

    const handleLogout = () => {
        dispatch(clearUser());
        navigate("/");
    };

    return (
        <header className={cx("admin-header")}>
            <div className={cx("logo")}>
                <ShieldCheck size={28} className={cx("logo-icon")} />
                <h2>Loop Admin</h2>
            </div>

            <nav className={cx("nav-links")}>
                <NavLink
                    to="/admin/reports"
                    className={({ isActive }) => cx("nav-item", { active: isActive })}
                >
                    <Flag size={18} />
                    <span>Báo cáo</span>
                </NavLink>

                <NavLink
                    to="/admin/accounts"
                    className={({ isActive }) => cx("nav-item", { active: isActive })}
                >
                    <Users size={18} />
                    <span>Tài khoản</span>
                </NavLink>

                <NavLink
                    to="/admin/chat"
                    className={({ isActive }) => cx("nav-item", { active: isActive })}
                >
                    <MessageSquare size={18} />
                    <span>Tin nhắn</span>
                </NavLink>
            </nav>

            <div className={cx("admin-profile")}>
                <div className={cx("admin-info")}>
                    <span className={cx("admin-name")}>{currentUser?.name || "Admin"}</span>
                    <span className={cx("admin-role")}>Quản trị viên</span>
                </div>
                <button className={cx("logout-btn")} onClick={handleLogout} title="Đăng xuất">
                    <LogOut size={18} />
                </button>
            </div>
        </header>
    );
}

export default AdminHeader;