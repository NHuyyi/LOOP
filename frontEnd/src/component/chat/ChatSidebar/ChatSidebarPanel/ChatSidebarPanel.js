import React from "react";
import classNames from "classnames/bind";
import styles from "../ChatSidebar.module.css";
import ConversationListComponent from "../../Conversation/ConversationList";
import RestrictedList from "../RestrictedList/RestrictedList";

const cx = classNames.bind(styles);

function ChatSidebarPanel({ activePanel, onClose }) {
  const title =
    activePanel === "search"
      ? "Tìm kiếm"
      : activePanel === "restricted"
        ? "Danh sách hạn chế"
        : activePanel === "blocked"
          ? "Danh sách chặn"
          : activePanel === "settings"
            ? "Cài đặt"
            : "Đoạn chat";

  const subtitle =
    activePanel === null
      ? "Các cuộc hội thoại gần đây của bạn."
      : activePanel === "restricted"
        ? "Những người bị hạn chế."
        : activePanel === "blocked"
          ? "Chức năng đang phát triển."
          : activePanel === "settings"
            ? "Các tùy chọn cài đặt."
            : "Tìm kiếm bạn bè hoặc đoạn chat.";

  return (
    <div className={cx("panel-container")}>
      <div className={cx("panel-header")}>
        <div>
          <h3 className={cx("panel-title")}>{title}</h3>
          <p className={cx("panel-subtitle")}>{subtitle}</p>
        </div>

        {activePanel !== null && (
          <button className={cx("panel-close")} onClick={onClose}>
            Đóng
          </button>
        )}
      </div>

      <div className={cx("panel-body")}>
        {activePanel === "restricted" && <RestrictedList />}

        {activePanel === "blocked" && (
          <div className={cx("panel-placeholder")}>
            Danh sách chặn đang phát triển
          </div>
        )}

        {activePanel === "settings" && (
          <div className={cx("panel-placeholder")}>Cài đặt đang phát triển</div>
        )}

        {(activePanel === null || activePanel === "search") && (
          <ConversationListComponent />
        )}
      </div>
    </div>
  );
}

export default ChatSidebarPanel;
