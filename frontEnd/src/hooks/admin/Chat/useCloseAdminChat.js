import { useState } from "react";
import { useToast } from "../../../context/ToastContext";
import { closeAdminChatAPI } from "../../../services/admin/Chat/closeAdminChatService";
import { useDispatch } from "react-redux";
import { updateConversationStatus } from "../../../redux/chatSlice";

export const useCloseAdminChat = () => {
    const toast = useToast();
    const dispatch = useDispatch();
    const [isClosing, setIsClosing] = useState(false);

    const executeCloseChat = async (conversationId) => {
        setIsClosing(true);
        try {
            const data = await closeAdminChatAPI(conversationId);
            if (data.success) {
                // Cập nhật Redux Store tại đây để UI đổi ngay lập tức
                dispatch(updateConversationStatus({ conversationId, status: 'closed' }));
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Lỗi khi đóng cuộc trò chuyện");
        } finally {
            setIsClosing(false);
        }
    };

    return { isClosing, executeCloseChat };
};