import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "../ActiveConversations/ActiveConversations.module.css";
import { MessageSquare } from "lucide-react";

const cx = classNames.bind(styles);

function ClosedConversations({ conversations, currentUser, onSelect }) {
    const [search, setSearch] = useState("");

    const filteredConvs = conversations.filter(conv => {
        const otherUser = conv.participants.find(p => p._id !== currentUser._id);
        if (!otherUser) return "tài khoản đã bị xóa".includes(search.toLowerCase());
        return otherUser.name.toLowerCase().includes(search.toLowerCase());
    });

    return (
        <div className={cx("column")}>
            <div className={cx("column-title")}>
                <MessageSquare size={18} color="#868e96" />
                Đã đóng ({conversations.length})
            </div>

            <input
                type="text"
                placeholder="Tìm cuộc trò chuyện đã đóng..."
                className={cx("search-input")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

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
                            <img src={isDeleted ? "/default-avatar.png" : (otherUser.avatar || "/default-avatar.png")} alt="Avatar" className={cx("avatar")} />
                            <div className={cx("info")}>
                                <p className={cx("name", { "deleted-text": isDeleted })}>
                                    {isDeleted ? "[Tài khoản bị xóa]" : otherUser.name}
                                </p>
                                <p className={cx("last-message")}>
                                    {conv.lastMessage ? conv.lastMessage.text : "Đoạn chat không còn khả dụng"}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ClosedConversations;