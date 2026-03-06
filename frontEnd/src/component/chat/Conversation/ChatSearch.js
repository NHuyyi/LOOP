import React from "react";
import styles from "./ConversationList.module.css"; // Tạm thời dùng chung CSS để không phải viết lại
import classNames from "classnames/bind";
import { Search } from "lucide-react";

const cx = classNames.bind(styles);

const ChatSearch = ({ searchText, setSearchText }) => {
  return (
    <div className={cx("search-bar")}>
      <div className={cx("search-input-wrapper")}>
        <Search className={cx("search-icon")} size={18} />
        <input
          type="text"
          placeholder="Tìm kiếm bạn bè..."
          className={cx("search-input")}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ChatSearch;
