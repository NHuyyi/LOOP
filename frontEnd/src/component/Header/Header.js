import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import styles from "./Header.module.css";
import classNames from "classnames/bind";
import logo from "../../img/logo.png";

const cx = classNames.bind(styles);

function Header() {
  const stateUser = useSelector((state) => state.user);
  const currentUser = stateUser?.user; // đây mới là user thực sự
  // load trước khi tải trang
  if (!currentUser)
    return <div className={cx("spinner-border text-light")}></div>;

  return (
    <header className={cx("header")}>
      <Link to="/home" className={cx("logo")}>
        <img src={logo} alt="avatar" className={cx("logo-image")} />
        <span>LOOP</span>
      </Link>

      <nav className={cx("nav")}>
        <NavLink
          to="/home"
          className={({ isActive }) => cx({ active: isActive })}
        >
          Khoảnh khắc
        </NavLink>
        <NavLink
          to="/chat"
          className={({ isActive }) => cx({ active: isActive })}
        >
          Chat
        </NavLink>
        <NavLink
          to="/streak"
          className={({ isActive }) => cx("navItem", { active: isActive })}
        >
          Streak 🔥
        </NavLink>
        <NavLink
          to="/friends"
          className={({ isActive }) => cx({ active: isActive })}
        >
          Bạn bè
        </NavLink>
      </nav>

      <Link to="/profile" style={{ textDecoration: "none", color: "inherit" }}>
        <div className={cx("userSection")}>
          <img src={currentUser.avatar} alt="avatar" className={cx("avatar")} />
          <p className={cx("userName")}>{currentUser.name || "Người dùng"}</p>
        </div>
      </Link>
    </header>
  );
}

export default Header;
