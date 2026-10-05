// hooks/admin/Chat/useStartAdminChat.js
import { useState } from "react";
import { useToast } from "../../../context/ToastContext";
import { startAdminChatAPI } from "../../../services/admin/Chat/startAdminChatService";
import { useDispatch } from "react-redux";
import { OpenMiniChat, updateConversationStatus } from "../../../redux/chatSlice";

export const useStartAdminChat = () => {
    const toast = useToast();
    const dispatch = useDispatch();
    const [isStarting, setIsStarting] = useState(false);

    // Nâng cấp: Nhận vào Object (targetUser) HOẶC chuỗi (targetUserId)
    const executeStartChat = async (targetUserOrId) => {
        setIsStarting(true);
        try {
            // Kiểm tra xem param truyền vào là object hay là chuỗi ID
            const isObject = typeof targetUserOrId === 'object' && targetUserOrId !== null;
            const targetId = isObject ? (targetUserOrId._id || targetUserOrId.id) : targetUserOrId;

            const data = await startAdminChatAPI(targetId);

            if (data.success) {
                // Chỉ mở MiniChat nếu param là object (Gọi từ giao diện Quản lý User)
                if (isObject) {
                    const normalizedReceiver = {
                        ...targetUserOrId,
                        _id: targetId,
                    };
                    dispatch(OpenMiniChat({
                        receiver: normalizedReceiver,
                        conversationId: data.conversation._id,
                        triggerBy: "click"
                    }));
                }

                // Luôn cập nhật trạng thái conversation thành active trong Redux
                dispatch(updateConversationStatus({
                    conversationId: data.conversation._id,
                    status: "active"
                }));

                // Trả về object để MessageInput có thể bắt được
                return { success: true, conversation: data.conversation };
            } else {
                toast.error(data.message || "Không thể khởi tạo cuộc trò chuyện");
                return { success: false };
            }
        } catch (error) {
            toast.error("Lỗi hệ thống khi mở cuộc trò chuyện");
            return { success: false };
        } finally {
            setIsStarting(false);
        }
    };

    return { isStarting, executeStartChat };
};