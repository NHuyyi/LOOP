import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearUser } from "../../../redux/userSlice";
import classNames from "classnames/bind";
import styles from "./LogoutAction.module.css";
import { LogOut } from "lucide-react";

const cx = classNames.bind(styles);

function LogoutAction() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        // Nếu cẩn thận, có thể thêm Modal Confirm "Bạn có chắc muốn đăng xuất?" ở đây
        dispatch(clearUser());
        navigate("/");
    };

    return (
        <button className={cx("logout-btn")} onClick={handleLogout}>
            <LogOut size={18} />
            <span>Đăng xuất</span>
        </button>
    );
}
export default LogoutAction;