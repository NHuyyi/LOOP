import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./ActiveConversations.module.css";
import { MessageSquare, XSquare } from "lucide-react";
import { useCloseAdminChat } from "../../../../hooks/admin/Chat/useCloseAdminChat";

const cx = classNames.bind(styles);

function ActiveConversations({ conversations, currentUser, onSelect }) {
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState([]);
    const { isClosing, executeCloseChat } = useCloseAdminChat();

    // Lọc theo tìm kiếm
    const filteredConvs = conversations.filter(conv => {
        const otherUser = conv.participants.find(p => p._id !== currentUser._id);
        if (!otherUser) return "tài khoản đã bị xóa".includes(search.toLowerCase());
        return otherUser.name.toLowerCase().includes(search.toLowerCase());
    });

    const toggleSelect = (e, convId) => {
        e.stopPropagation(); // Ngăn không cho click nhầm sang mở MiniChat
        if (selected.includes(convId)) {
            setSelected(selected.filter(id => id !== convId));
        } else {
            setSelected([...selected, convId]);
        }
    };

    const handleSelectAll = () => {
        // Nếu số lượng đã chọn bằng với số lượng đang hiển thị -> Bỏ chọn tất cả
        if (selected.length === filteredConvs.length && filteredConvs.length > 0) {
            setSelected([]);
        } else {
            // Nếu chưa chọn hết -> Chọn tất cả các mục ĐANG HIỂN THỊ (sau khi lọc)
            setSelected(filteredConvs.map(conv => conv._id));
        }
    };

    const handleBulkClose = async () => {
        for (const id of selected) {
            await executeCloseChat(id);
        }
        setSelected([]); // Clear sau khi đóng xong
    };

    return (
        <div className={cx("column")}>
            <div className={cx("column-title")}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MessageSquare size={18} color="#339af0" />
                    Chưa đóng ({conversations.length})
                </div>
                {selected.length > 0 && (
                    <button
                        className={cx("bulk-close-btn")}
                        onClick={handleBulkClose}
                        disabled={isClosing}
                    >
                        <XSquare size={14} /> Đóng {selected.length} mục
                    </button>
                )}
            </div>

            <input
                type="text"
                placeholder="Tìm cuộc trò chuyện..."
                className={cx("search-input")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className={cx("select-all-container")} onClick={handleSelectAll}>
                <input
                    type="checkbox"
                    checked={selected.length === filteredConvs.length && filteredConvs.length > 0}
                    readOnly
                    className={cx("select-checkbox")}
                />
                <span className={cx("select-all-label")}>Chọn tất cả</span>
            </div>

            <div className={cx("conversation-list")}>
                {filteredConvs.length === 0 && <p className={cx("empty-text")}>Không có dữ liệu</p>}

                {filteredConvs.map(conv => {
                    const otherUser = conv.participants.find(p => p._id !== currentUser._id);
                    const isDeleted = !otherUser;

                    return (
                        <div
                            key={conv._id}
                            className={cx("conversation-item", { deleted: isDeleted })}
                            onClick={() => onSelect(conv)}
                        >
                            <input
                                type="checkbox"
                                className={cx("select-checkbox")}
                                checked={selected.includes(conv._id)}
                                onChange={(e) => toggleSelect(e, conv._id)}
                                onClick={(e) => e.stopPropagation()}
                            />
                            <img src={isDeleted ? "/default-avatar.png" : (otherUser.avatar || "/default-avatar.png")} alt="Avatar" className={cx("avatar")} />
                            <div className={cx("info")}>
                                <p className={cx("name", { "deleted-text": isDeleted })}>
                                    {isDeleted ? "[Tài khoản bị xóa]" : otherUser.name}
                                </p>
                                <p className={cx("last-message")}>
                                    {conv.lastMessage ? conv.lastMessage.text : "Chưa có tin nhắn"}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ActiveConversations;