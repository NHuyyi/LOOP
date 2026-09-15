import React, { createContext, useContext, useState, useCallback } from "react";
import Toast from "../component/Toast/Toast";

const ToastContext = createContext();

export const useToast = () => {
    return useContext(ToastContext);
};

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState(null);

    const showToast = useCallback((message, type = "success") => {
        const id = Date.now(); // Tạo ID duy nhất để tránh xung đột nếu gọi liên tục
        setToast({ id, message, type, fadeOut: false });

        // Bắt đầu hiệu ứng fade-out sau 2.5s
        setTimeout(() => {
            setToast((prev) => (prev?.id === id ? { ...prev, fadeOut: true } : prev));
        }, 2500);

        // Xóa hẳn component khỏi DOM sau 3s
        setTimeout(() => {
            setToast((prev) => (prev?.id === id ? null : prev));
        }, 3000);
    }, []);

    return (
        <ToastContext.Provider value={{
            success: (msg) => showToast(msg, "success"),
            error: (msg) => showToast(msg, "error"),
        }}>
            {children}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    fadeOut={toast.fadeOut}
                />
            )}
        </ToastContext.Provider>
    );
};