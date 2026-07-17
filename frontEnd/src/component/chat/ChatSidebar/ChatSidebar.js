import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./ChatSidebar.module.css";
import {
  MessageCircle,
  ShieldAlert,
  Search,
  Menu,
  Settings,
  UserX,
} from "lucide-react";
import { useSelector } from "react-redux";

const cx = classNames.bind(styles);

function ChatSidebar({ activeView, setActiveView }) {
  // Chỉ phóng to/thu nhỏ khi nhấn nút 3 gạch
  const [isExpanded, setIsExpanded] = useState(false);
  const currentUser = useSelector((state) => state.user?.user);

  return (
    <div className={cx("sidebar-container", { expanded: isExpanded })}>
      {/* Nút 3 gạch (Hamburger) */}
      <div className={cx("top-header")}>
        <button
          className={cx("toggle-btn")}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Menu size={24} />
        </button>
        {isExpanded && <span className={cx("brand-name")}>Loop</span>}
      </div>

      {/* Các menu tính năng */}
      <div className={cx("nav-menu")}>
        <div
          className={cx("nav-item", { active: activeView === "conversations" })}
          onClick={() => setActiveView("conversations")}
          title="Đoạn chat"
        >
          <MessageCircle size={22} className={cx("icon")} />
          {isExpanded && <span className={cx("label")}>Đoạn chat</span>}
        </div>

        <div
          className={cx("nav-item", { active: activeView === "search" })}
          onClick={() => setActiveView("search")}
          title="Tìm kiếm"
        >
          <Search size={22} className={cx("icon")} />
          {isExpanded && <span className={cx("label")}>Tìm kiếm</span>}
        </div>

        <div
          className={cx("nav-item", { active: activeView === "restricted" })}
          onClick={() => setActiveView("restricted")}
          title="Danh sách hạn chế"
        >
          <ShieldAlert size={22} className={cx("icon")} />
          {isExpanded && <span className={cx("label")}>Danh sách hạn chế</span>}
        </div>

        <div
          className={cx("nav-item", { active: activeView === "blocked" })}
          onClick={() => setActiveView("blocked")}
          title="Danh sách chặn"
        >
          <UserX size={22} className={cx("icon")} />
          {isExpanded && <span className={cx("label")}>Danh sách chặn</span>}
        </div>
      </div>

      {/* Cài đặt & Avatar dưới cùng */}
      <div className={cx("bottom-menu")}>
        <div
          className={cx("nav-item", { active: activeView === "settings" })}
          onClick={() => setActiveView("settings")}
          title="Cài đặt"
        >
          <Settings size={22} className={cx("icon")} />
          {isExpanded && <span className={cx("label")}>Cài đặt</span>}
        </div>

        <div className={cx("nav-item", "profile-item")}>
          <img
            src={
              currentUser?.avatar ||
              "https://res.cloudinary.com/dpym64zg9/image/upload/v1755614090/raw_cq4nqn.png"
            }
            alt="User"
            className={cx("profile-avatar")}
          />
          {isExpanded && (
            <span className={cx("label", "profile-name")}>
              {currentUser?.name || "Người dùng"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatSidebar;
