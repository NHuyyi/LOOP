import React from "react";
import classNames from "classnames/bind";
import styles from "./Toast.module.css";
import { CheckCircle, AlertCircle } from "lucide-react";

const cx = classNames.bind(styles);

function Toast({ message, type, fadeOut }) {
    return (
        <div className={cx("toast-message", type === "error" ? "error" : "success", { "fade-out": fadeOut })}>
            {type === "error" ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
            <span>{message}</span>
        </div>
    );
}

export default Toast;