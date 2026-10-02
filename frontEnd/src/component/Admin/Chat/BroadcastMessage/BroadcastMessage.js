import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./BroadcastMessage.module.css";
import { Send, X } from "lucide-react";
import { sendMessage } from "../../../../services/chat/sendMessage";
import { useStartAdminChat } from "../../../../hooks/admin/Chat/useStartAdminChat";
import { useRichTextEditor } from "../../../../hooks/useRichTextEditor";
import ImageUpload from "../../../../component/chat/MessageInput/ImageUpload";
import uploadImage from "../../../../services/Post/uploadImage";
import Loading from "../../../../component/Loading/Loading";
import { useToast } from "../../../../context/ToastContext";
import { useDispatch } from "react-redux";
import { addMessage, updateLastMessage } from "../../../../redux/chatSlice";

const cx = classNames.bind(styles);

function BroadcastMessage({ users, ConversationList }) {
    const [searchText, setSearchText] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isSending, setIsSending] = useState(false);

    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const toast = useToast();
    const dispatch = useDispatch();
    const { isStarting, executeStartChat } = useStartAdminChat();
    const { editorRef, getParsedText, clearEditor } = useRichTextEditor();

    const filteredUsers = users.filter((u) =>
        u.name.toLowerCase().includes(searchText.toLowerCase()) ||
        u.email.toLowerCase().includes(searchText.toLowerCase())
    );

    const toggleSelectUser = (userId) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        } else {
            setSelectedUsers([...selectedUsers, userId]);
        }
    };

    const handleSelectAll = () => {
        if (selectedUsers.length === filteredUsers.length && filteredUsers.length > 0) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(filteredUsers.map(u => u._id || u.id));
        }
    };

    const handleSendBroadcast = async () => {
        const textToSend = getParsedText();
        if (selectedUsers.length === 0 || (!textToSend.trim() && !selectedImage)) return;

        setIsSending(true); setIsUploading(true);

        try {
            let uploadedImageUrl = null;
            if (selectedImage) {
                const imageRes = await uploadImage(selectedImage, "LOOP_CHAT");
                if (imageRes.data?.url) {
                    uploadedImageUrl = imageRes.data.url;
                } else {
                    toast.error("Tải ảnh thất bại!");
                    setIsSending(false); setIsUploading(false);
                    return;
                }
            }

            for (const receiverId of selectedUsers) {
                let targetConv = ConversationList.find(c =>
                    c.type === "admin_direct" &&
                    c.participants.some(p => String(p._id || p) === String(receiverId))
                );

                let currentConvId = targetConv ? targetConv._id : null;

                if (!targetConv || targetConv.status === "closed") {
                    const startRes = await executeStartChat(receiverId);
                    if (startRes && startRes.success) {
                        currentConvId = startRes.conversation._id;
                    } else {
                        continue;
                    }
                }

                const payload = {
                    receiverId, text: textToSend, imageUrl: uploadedImageUrl,
                    messageType: uploadedImageUrl ? "image" : "text", isForwarded: false,
                    conversationId: currentConvId
                };

                const res = await sendMessage(payload);
                if (res?.success) {
                    const newMessage = res.message;
                    const actualConvId = newMessage.conversationId?._id || newMessage.conversationId || currentConvId;
                    dispatch(addMessage({ conversationId: actualConvId, message: newMessage }));
                    dispatch(updateLastMessage({ conversationId: actualConvId, message: newMessage }));
                }
            }

            toast.success("Đã gửi tin nhắn chung thành công!");
            setSelectedUsers([]); clearEditor(); setSelectedImage(null); setImagePreview(null);

        } catch (error) {
            toast.error("Có lỗi xảy ra khi gửi tin nhắn chung.");
        } finally {
            setIsSending(false); setIsUploading(false);
        }
    };

    return (
        <div className={cx("column")}>
            <div className={cx("column-title")}>
                <Send size={18} color="#20c997" /> Gửi tin nhắn chung
            </div>

            <input
                type="text"
                placeholder="Tìm kiếm người dùng..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className={cx("search-input")}
            />

            <div className={cx("select-all-container")} onClick={handleSelectAll}>
                <input type="checkbox" checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0} readOnly className={cx("select-checkbox")} />
                <span className={cx("select-all-label")}>Chọn tất cả</span>
            </div>

            <div className={cx("user-list")}>
                {filteredUsers.map((user) => (
                    <div key={user._id || user.id} className={cx("user-item")} onClick={() => toggleSelectUser(user._id || user.id)}>
                        <div className={cx("user-item-info")}>
                            <img src={user.avatar || "/default-avatar.png"} alt={user.name} className={cx("user-avatar")} />
                            <div className={cx("user-text")}>
                                <p className={cx("user-name")}>{user.name}</p>
                                <p className={cx("user-email")}>{user.email}</p>
                            </div>
                        </div>
                        <input type="checkbox" checked={selectedUsers.includes(user._id || user.id)} readOnly className={cx("select-checkbox")} />
                    </div>
                ))}
            </div>

            <div className={cx("editor-container")}>
                <div style={{ display: "flex", gap: "12px", marginBottom: "10px" }}>
                    <ImageUpload
                        isUploading={isUploading}
                        onImageSelect={(file, preview) => {
                            setSelectedImage(file); setImagePreview(preview);
                            if (editorRef.current) {
                                editorRef.current.focus();
                                const range = document.createRange();
                                range.selectNodeContents(editorRef.current);
                                range.collapse(false);
                                window.getSelection().removeAllRanges();
                                window.getSelection().addRange(range);
                            }
                        }}
                    />
                </div>

                <div style={{ position: "relative" }}>
                    {/* Preview ảnh nếu có */}
                    {imagePreview && (
                        <div className={cx("image-preview-wrapper")}>
                            <div className={cx("image-preview")}>
                                <img src={imagePreview} alt="Preview" />
                                <button
                                    type="button"
                                    onClick={() => { setSelectedImage(null); setImagePreview(null); }}
                                    className={cx("remove-img-btn")}
                                >
                                    <X size={14} />
                                </button>
                                {isUploading && <div className={cx("overlay")}><Loading size="small" /></div>}
                            </div>
                        </div>
                    )}
                    <div
                        contentEditable={!isUploading} ref={editorRef}
                        onInput={(e) => { if (editorRef.current && ["<br>", "<div><br></div>", "<br><br>"].includes(editorRef.current.innerHTML)) editorRef.current.innerHTML = ""; }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault(); // Ngăn trình duyệt tự động xuống dòng
                                // Kiểm tra các điều kiện (giống như disable của button) trước khi gọi hàm
                                if (!isSending && !isStarting && !isUploading && selectedUsers.length > 0) {
                                    handleSendBroadcast();
                                }
                            }
                        }}
                        className={cx("text-editor")}
                        data-placeholder="Nhập nội dung tin nhắn chung..."
                    />
                    <style dangerouslySetInnerHTML={{ __html: `div[contentEditable]:empty:before { content: attr(data-placeholder); color: #adb5bd; pointer-events: none; display: block; }` }} />
                </div>
            </div>

            <button className={cx("send-btn")} onClick={handleSendBroadcast} disabled={isSending || isStarting || isUploading || selectedUsers.length === 0} >
                {isSending ? "Đang gửi..." : "Gửi tin nhắn"}
            </button>
        </div>
    );
}

export default BroadcastMessage;