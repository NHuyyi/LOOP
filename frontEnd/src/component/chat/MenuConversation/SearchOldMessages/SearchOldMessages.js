import React, { useState, useEffect } from "react";
import styles from "./SearchOldMessages.module.css";
import classNames from "classnames/bind";
import { getMessages } from "../../../../services/chat/getMessages";
import { Search } from "lucide-react";
import { useEmojiParser } from "../../../../hooks/useEmojiParser";

const cx = classNames.bind(styles);

const SearchOldMessages = ({ conversationId }) => {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const { parseEmojis } = useEmojiParser();
  useEffect(() => {
    const fetchMessages = async () => {
      if (!searchText.trim()) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const res = await getMessages(conversationId, 1, searchText);
        if (res.success) {
          setSearchResults(res.messages);
        }
      } catch (err) {
        console.error("Lỗi khi tìm kiếm tin nhắn:", err);
      } finally {
        setIsSearching(false);
      }
    };
    const delayDebounceFn = setTimeout(() => {
      fetchMessages();
    }, 500); // Đợi 500ms sau khi người dùng ngừng gõ để thực hiện tìm kiếm

    return () => clearTimeout(delayDebounceFn);
  }, [searchText, conversationId]);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* Khung nhập tìm kiếm (vẫn giữ nguyên giao diện cũ của bạn) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          border: "1px solid #ccc",
          borderRadius: "20px",
          padding: "5px 10px",
        }}
      >
        <Search size={18} color="gray" />
        <input
          type="text"
          placeholder="Tìm tin nhắn..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            border: "none",
            outline: "none",
            width: "100%",
            marginLeft: "8px",
          }}
        />
      </div>

      {/* Danh sách kết quả sử dụng CSS Module */}
      {searchText && (
        <div className={cx("resultsWrapper")}>
          {isSearching ? (
            <div className={cx("statusText")}>Đang tìm kiếm...</div>
          ) : searchResults.length > 0 ? (
            searchResults.map((msg) => (
              <div key={msg._id} className={cx("resultCard")}>
                {/* Tên người gửi */}
                <div className={cx("senderName")}>{msg.senderId?.name}</div>

                {/* Nội dung tin nhắn */}
                <div className={cx("messageText")}>{parseEmojis(msg.text)}</div>

                {/* Thời gian */}
                <div className={cx("timeText")}>
                  {new Date(msg.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          ) : (
            <div className={cx("statusText")}>Không có kết quả nào</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchOldMessages;
