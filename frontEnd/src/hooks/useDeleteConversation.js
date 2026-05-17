import { useState } from "react";
import { deleteConversation } from "../services/chat/deleteConversation";

export const useDeleteConversation = () => {
  const [isDeleting, setIsDeleting] = useState(false);

  // Không dùng window.confirm hay alert ở đây nữa
  const executeDelete = async (conversationId) => {
    setIsDeleting(true);
    try {
      const response = await deleteConversation(conversationId);
      return response; // Trả về { success: true/false, message: ... } để Component tự xử lý
    } catch (error) {
      console.error("Lỗi khi xóa chat:", error);
      return { success: false, message: "Lỗi hệ thống máy chủ." };
    } finally {
      setIsDeleting(false);
    }
  };

  return { executeDelete, isDeleting };
};
