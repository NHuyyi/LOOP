import React from "react";
import classNames from "classnames/bind";
import styles from "./UserActions.module.css";
import { Lock, Unlock, MessageSquare, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { OpenMiniChat } from "../../../../redux/chatSlice";

const cx = classNames.bind(styles);

function UserActions({ user, openDeleteModal, openBanModal, openUnlockModal }) {
    const dispatch = useDispatch();
    const ConversationList = useSelector(state => state.chat.ConversationList);

    const handleMessageClick = () => {
        const existingConv = ConversationList.find(c => 
            c.participants && c.participants.some(p => String(p._id) === String(user.id))
        );

        dispatch(OpenMiniChat({
            receiver: { ...user, _id: user.id },
            conversationId: existingConv?._id,
            triggerBy: "click"
        }));
    };

    // Các hàm xử lý click sẽ được gắn vào sau
    return (
        <div className={cx("actions")}>
            <button className={cx("action-btn", "msg-btn")} title="Nhắn tin" onClick={handleMessageClick}>
                <MessageSquare size={16} />
            </button>

            {user.isBanned ? (
                <button className={cx("action-btn", "unlock-btn")} title="Mở khóa" onClick={() => openUnlockModal(user)}>
                    <Unlock size={16} />
                </button>
            ) : (
                <button className={cx("action-btn", "lock-btn")} title="Khóa tài khoản" onClick={() => openBanModal(user)}>
                    <Lock size={16} />
                </button>
            )}

            <button className={cx("action-btn", "delete-btn")} title="Xóa vĩnh viễn"
                onClick={() => openDeleteModal(user)}>
                <Trash2 size={16} />
            </button>
        </div>
    );
}

export default UserActions;