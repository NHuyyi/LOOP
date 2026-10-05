exports.validateAdminChatPermission = (conversation) => {
    if (conversation.type === "admin_direct") {
        if (conversation.status === "closed") {
            return {
                isAllowed: false,
                message: "Cuộc trò chuyện này đã bị đóng bởi Admin."
            };
        }
    }
    return { isAllowed: true };
};