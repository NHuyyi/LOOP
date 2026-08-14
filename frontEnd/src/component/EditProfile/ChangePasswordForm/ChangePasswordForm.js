import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./ChangePasswordForm.module.css";
import { Eye, EyeOff, ShieldCheck, Key, Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import { verifyOldPassword } from "../../../services/User/verifyOldPassword";
import { requestChangePassword } from "../../../services/User/requestChangePassword";
import { verifyOTP } from "../../../services/User/verifyOTP";
import Loading from "../../Loading/Loading";

const cx = classNames.bind(styles);

function ChangePasswordForm() {
    const user = useSelector((state) => state.user.user);
    const navigate = useNavigate();

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
    const [showConfirmNewPass, setShowConfirmNewPass] = useState(false);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setFadeOut(true), 2500);
            const removeTimer = setTimeout(() => {
                setMessage("");
                setFadeOut(false);
            }, 3000);
            return () => {
                clearTimeout(timer);
                clearTimeout(removeTimer);
            };
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
            setSuccess(true);
            navigate("/profile");
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
        <div className={cx("form-wrapper")}>
            <div className={cx("form-container")}>

                {/* Stepper Header */}
                <div className={cx("stepper-container")}>
                    <div className={cx("step", { active: step >= 1, completed: step > 1 })}>
                        <div className={cx("step-icon")}>{step > 1 ? <CheckCircle2 size={16} /> : 1}</div>
                        <span>Xác thực</span>
                    </div>
                    <div className={cx("step-line", { active: step >= 2 })}></div>
                    <div className={cx("step", { active: step >= 2, completed: step > 3 })}>
                        <div className={cx("step-icon")}>{step > 2 ? <CheckCircle2 size={16} /> : 2}</div>
                        <span>Mật khẩu mới</span>
                    </div>
                    <div className={cx("step-line", { active: step === 3 })}></div>
                    <div className={cx("step", { active: step === 3 })}>
                        <div className={cx("step-icon")}>3</div>
                        <span>Mã OTP</span>
                    </div>
                </div>

                <div className={cx("form-content")}>
                    {step === 1 && (
                        <form onSubmit={handleVerifyOldPass} className={cx("fade-in-up")}>
                            <div className={cx("form-header")}>
                                <div className={cx("icon-wrapper")}><Lock size={28} /></div>
                                <h3 className={cx("title")}>Xác thực mật khẩu</h3>
                                <p className={cx("subtitle")}>Vui lòng nhập mật khẩu hiện tại của bạn để tiếp tục.</p>
                            </div>

                            <div className={cx("input-group")}>
                                <label className={cx("form-label")}>Mật khẩu cũ</label>
                                <div className={cx("border-input")}>
                                    <input
                                        type={showOldPass ? "text" : "password"}
                                        className={cx("custom-input")}
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        placeholder="Nhập mật khẩu hiện tại..."
                                        required
                                    />
                                    <button type="button" className={cx("show-btn")} onClick={() => setShowOldPass(!showOldPass)}>
                                        {showOldPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            <button type="submit" className={cx("app-btn", "submit-btn")} disabled={loading}>
                                {loading ? <Loading size="small" /> : <><ArrowRight size={18} /> Tiếp tục</>}
                            </button>
                            <div className={cx("forgot-link")}>
                                <Link to="/forget-password">Bạn quên mật khẩu?</Link>
                            </div>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleRequestOTP} className={cx("fade-in-up")}>
                            <div className={cx("form-header")}>
                                <div className={cx("icon-wrapper")}><Key size={28} /></div>
                                <h3 className={cx("title")}>Thiết lập mật khẩu mới</h3>
                                <p className={cx("subtitle")}>Mật khẩu nên chứa ít nhất 8 ký tự bao gồm chữ và số.</p>
                            </div>

                            <div className={cx("input-group")}>
                                <label className={cx("form-label")}>Mật khẩu mới</label>
                                <div className={cx("border-input")}>
                                    <input
                                        type={showNewPass ? "text" : "password"}
                                        className={cx("custom-input")}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Nhập mật khẩu mới..."
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
                                        type={showConfirmNewPass ? "text" : "password"}
                                        className={cx("custom-input")}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Nhập lại mật khẩu mới..."
                                        required
                                    />
                                    <button type="button" className={cx("show-btn")} onClick={() => setShowConfirmNewPass(!showConfirmNewPass)}>
                                        {showConfirmNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            <button type="submit" className={cx("app-btn", "submit-btn")} disabled={loading}>
                                {loading ? <Loading size="small" /> : <><ShieldCheck size={18} /> Yêu cầu OTP</>}
                            </button>
                        </form>
                    )}

                    {step === 3 && (
                        <form onSubmit={handleVerifyOTP} className={cx("fade-in-up")}>
                            <div className={cx("form-header")}>
                                <div className={cx("icon-wrapper")}><ShieldCheck size={28} /></div>
                                <h3 className={cx("title")}>Xác thực mã OTP</h3>
                                <p className={cx("subtitle")}>Mã bảo mật gồm 6 số đã được gửi đến email của bạn.</p>
                            </div>

                            <div className={cx("input-group")}>
                                <label className={cx("form-label")}>Mã OTP</label>
                                <div className={cx("border-input", "otp-input-wrapper")}>
                                    <input
                                        type="text"
                                        className={cx("custom-input", "text-center")}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                        placeholder="• • • • • •"
                                        maxLength={6}
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" className={cx("app-btn", "submit-btn")} disabled={loading}>
                                {loading ? <Loading size="small" /> : <><CheckCircle2 size={18} /> Hoàn tất đổi mật khẩu</>}
                            </button>
                        </form>
                    )}
                </div>

                {message && (
                    <div
                        className={`${cx("app-message")} ${success ? cx("app-message__ok") : cx("app-message__err")} ${fadeOut ? cx("fade-out") : ""}`}
                    >
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChangePasswordForm;