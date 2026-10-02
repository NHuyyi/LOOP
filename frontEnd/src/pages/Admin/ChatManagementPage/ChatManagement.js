import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./ChatManagement.module.css";
import { getAllUsers } from "../../../services/admin/getAllUsers";
import { getConversations } from "../../../services/chat/getConversations";
import Loading from "../../../component/Loading/Loading";
import { useToast } from "../../../context/ToastContext";
import { useSelector, useDispatch } from "react-redux";
import { OpenMiniChat, setConversations } from "../../../redux/chatSlice";

// Import 3 thành phần con
import ActiveConversations from "../../../component/Admin/Chat/ActiveConversations/ActiveConversations";
import ClosedConversations from "../../../component/Admin/Chat/ClosedConversations/ClosedConversations";
import BroadcastMessage from "../../../component/Admin/Chat/BroadcastMessage/BroadcastMessage";

const cx = classNames.bind(styles);

function ChatManagementPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const currentUser = useSelector((state) => state.user.user);
    const { ConversationList = [] } = useSelector((state) => state.chat);

    const toast = useToast();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const usersRes = await getAllUsers();
                if (usersRes.success) setUsers(usersRes.data);

                const convRes = await getConversations();
                if (convRes.success) {
                    dispatch(setConversations(convRes.conversations || []));
                }
            } catch (error) {
                toast.error("Lỗi tải dữ liệu");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    if (loading) return <Loading fullScreen text="Đang tải dữ liệu..." />;

    // Phân loại cuộc trò chuyện
    const activeConvs = ConversationList.filter(c => c.type === "admin_direct" && c.status === "active");
    const closedConvs = ConversationList.filter(c => c.type === "admin_direct" && c.status === "closed");

    // Hàm mở MiniChat dùng chung
    const handleSelectConversation = (conv) => {
        const otherUser = conv.participants.find(p => p._id !== currentUser._id);
        if (otherUser) {
            dispatch(OpenMiniChat({
                receiver: otherUser,
                conversationId: conv._id,
                triggerBy: "click"
            }));
        } else {
            toast.error("Người dùng này đã bị xóa khỏi hệ thống, không thể xem tin nhắn.");
        }
    };

    return (
        <div className={cx("management-container")}>
            <div className={cx("card")}>
                <h3 className={cx("card-title")}>Quản lý Nhắn tin</h3>
                <div className={cx("layout-wrapper")}>
                    {/* Dòng 1: 2 Cột */}
                    <div className={cx("row-top")}>
                        <ActiveConversations
                            conversations={activeConvs}
                            currentUser={currentUser}
                            onSelect={handleSelectConversation}
                        />
                        <ClosedConversations
                            conversations={closedConvs}
                            currentUser={currentUser}
                            onSelect={handleSelectConversation}
                        />
                    </div>
                    {/* Dòng 2: 1 Cột (Broadcast) */}
                    <div className={cx("row-bottom")}>
                        <BroadcastMessage
                            users={users}
                            ConversationList={ConversationList}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatManagementPage;