import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./ChangePasswordForm.module.css";
import { Eye, EyeOff } from "lucide-react";

import { verifyOldPassword } from "../../../services/User/verifyOldPassword";
import { requestChangePassword } from "../../../services/User/requestChangePassword";
import { verifyOTP } from "../../../services/User/verifyOTP";
import Loading from "../../Loading/Loading";

const cx = classNames.bind(styles);

function ChangePasswordForm() {
    const user = useSelector((state) => state.user.user);

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(null);
    const [fadeOut, setFadeOut] = useState(false);

    // States form
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [otp, setOtp] = useState("");

    // Toggles password visibility
    const [showOldPass, setShowOldPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setFadeOut(true), 2500);
            const removeTimer = setTimeout(() => {
                setMessage("");
                setFadeOut(false);
            }, 3000);
            return () => { clearTimeout(timer); clearTimeout(removeTimer); };
        }
    }, [message]);

    const handleVerifyOldPass = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = await verifyOldPassword(oldPassword);
        if (data.success) {
            setStep(2);
        } else {
            setMessage(data.message);
            setSuccess(false);
        }
        setLoading(false);
    };

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage("Mật khẩu mới không khớp!");
            setSuccess(false);
            return;
        }
        setLoading(true);
        const data = await requestChangePassword();
        if (data.success) {
            setStep(3);
            setMessage(data.message);
            setSuccess(true);
        } else {
            setMessage(data.message);
            setSuccess(false);
        }
        setLoading(false);
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = await verifyOTP(user.email, newPassword, otp);
        if (data.success) {
            setMessage("Đổi mật khẩu thành công!");
            setSuccess(true);
            // Reset form
            setStep(1);
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setOtp("");
        } else {
            setMessage(data.message);
            setSuccess(false);
        }
        setLoading(false);
    };

    return (
        <div className={cx("form-container")}>
            <h3 className={cx("title")}>Bảo mật & Mật khẩu</h3>

            {step === 1 && (
                <form onSubmit={handleVerifyOldPass}>
                    <div className={cx("input-group")}>
                        <label className={cx("form-label")}>Mật khẩu cũ</label>
                        <div className={cx("border-input")}>
                            <input
                                type={showOldPass ? "text" : "password"}
                                className={cx("custom-input")}
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                            />
                            <button type="button" className={cx("show-btn")} onClick={() => setShowOldPass(!showOldPass)}>
                                {showOldPass ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className={cx("app-btn", "submit-btn")} disabled={loading}>
                        {loading ? <Loading size="small" /> : "Xác nhận mật khẩu"}
                    </button>
                    <div className={cx("forgot-link")}>
                        <Link to="/forget-password">Bạn quên mật khẩu?</Link>
                    </div>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={handleRequestOTP}>
                    <div className={cx("input-group")}>
                        <label className={cx("form-label")}>Mật khẩu mới</label>
                        <div className={cx("border-input")}>
                            <input
                                type={showNewPass ? "text" : "password"}
                                className={cx("custom-input")}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <button type="button" className={cx("show-btn")} onClick={() => setShowNewPass(!showNewPass)}>
                                {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <div className={cx("input-group")}>
                        <label className={cx("form-label")}>Xác nhận mật khẩu mới</label>
                        <div className={cx("border-input")}>
                            <input
                                type="password"
                                className={cx("custom-input")}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className={cx("app-btn", "submit-btn")} disabled={loading}>
                        {loading ? <Loading size="small" /> : "Nhận mã OTP"}
                    </button>
                </form>
            )}

            {step === 3 && (
                <form onSubmit={handleVerifyOTP}>
                    <div className={cx("input-group")}>
                        <label className={cx("form-label")}>Mã OTP</label>
                        <div className={cx("border-input")}>
                            <input
                                type="text"
                                className={cx("custom-input")}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Nhập mã 6 số"
                                maxLength={6}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className={cx("app-btn", "submit-btn")} disabled={loading}>
                        {loading ? <Loading size="small" /> : "Xác thực & Đổi mật khẩu"}
                    </button>
                </form>
            )}

            {message && (
                <div
                    className={`${cx("app-message")} ${success ? cx("app-message__ok") : cx("app-message__err")
                        } ${fadeOut ? cx("fade-out") : ""}`}
                >
                    {message}
                </div>
            )}
        </div>
    );
}

export default ChangePasswordForm;