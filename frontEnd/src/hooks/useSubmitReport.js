import { useState } from "react";
import { useToast } from "../context/ToastContext";
import { submitReport } from "../services/User/reportService";
import uploadImage from "../services/Post/uploadImage";

export const useSubmitReport = () => {
    const toast = useToast();
    const [modalState, setModalState] = useState({ isOpen: false, targetUser: null });
    const [reasonLabel, setReasonLabel] = useState("spam");
    const [description, setDescription] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const openReportModal = (user) => {
        setModalState({ isOpen: true, targetUser: user });
        setReasonLabel("spam");
        setDescription("");
        setImageFile(null);
        setImagePreview(null);
    };

    const closeReportModal = () => setModalState({ isOpen: false, targetUser: null });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleReport = async () => {
        if (!modalState.targetUser) return;
        setIsSubmitting(true);
        try {
            let evidenceImage = "";
            if (imageFile) {
                const uploadRes = await uploadImage(imageFile, "REPORT_EVIDENCE");
                evidenceImage = uploadRes.data?.url || uploadRes.url || "";
            }

            const data = await submitReport(modalState.targetUser._id, reasonLabel, description.trim(), evidenceImage);
            if (data && data.success) {
                toast.success(data.message);
                closeReportModal();
            } else {
                toast.error(data?.message || "Không thể gửi báo cáo!");
            }
        } catch (error) {
            toast.error("Lỗi máy chủ!");
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        modalState, reasonLabel, setReasonLabel, description, setDescription,
        imagePreview, handleImageChange, isSubmitting, openReportModal, closeReportModal, handleReport
    };
};