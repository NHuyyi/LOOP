// Otp.js
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOTP } from "../../services/User/verifyOTP";
import { resendOTP } from "../../services/User/resendOTP";
// để lưu user vào redux
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/userSlice";
import classNames from "classnames/bind";
import styles from "./verifyOTPPage.module.css";

const cx = classNames.bind(styles);

function Otp() {
  const location = useLocation();
  const email = location.state?.email;
  const password = location.state?.password || "";
  const [codeotp, setCodeOtp] = useState(new Array(6).fill(""));
  const [loadingverify, setLoadingverify] = useState(false);
  const [loadingresend, setLoadingresend] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [fadeOut, setFadeOut] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ hook để điều hướng

  // Hàm xử lý khi nhập số
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false; // chỉ cho nhập số
    let newCodeOtp = [...codeotp];
    newCodeOtp[index] = element.value;
    setCodeOtp(newCodeOtp);

    // Tự động focus sang ô tiếp theo
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  // 👇 tự động xóa message sau 5s
  useEffect(() => {
    if (message) {
      // Sau 4.5s bắt đầu fade out
      const timer = setTimeout(() => {
        setFadeOut(true);
      }, 2500);

      // Sau 5s thì xóa message
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const otp = codeotp.join("");
      setLoadingverify(true);
      const data = await verifyOTP(email, password, otp);
      setMessage(data.message);
      setSuccess(data.success);
      if (data.otptype === "signup") {
        dispatch(setUser({ user: data.user, token: data.token }));
        // lưu vào localStorage để giữ đăng nhập sau reload
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        navigate("/home");
      }
      if (data.otptype === "reset") {
        navigate("/reset-password", { state: { email: email } });
      }
      if (data.otptype === "change") {
        navigate("/", { state: { email: email } });
      }
    } catch (error) {
      console.error("API error:", error.message);
      setMessage(error.message);
      setSuccess(false);
      // Hiển thị thông báo lỗi cho người dùng tại đây
    } finally {
      setLoadingverify(false);
    }
  };

  const resendSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoadingresend(true);
      const resuit = await resendOTP(email);
      setMessage(resuit.message);
      setSuccess(resuit.success);
    } catch (error) {
      console.error("API error:", error.message);
      setMessage(error.message);
      setSuccess(false);
      // Hiển thị thông báo lỗi cho người dùng tại đây
    } finally {
      setLoadingresend(false);
    }
  };

  return (
    <div className={cx("app-container")}>
      <div className={cx("card", "p-5", "rounded-3", "shadow")}>
        <h2 className={cx("app-title")}>Nhập OTP</h2>
        <p className={cx("app-desc")}>
          Vui lòng nhập mã OTP được gửi tới <b>{email}</b>
        </p>
        <form className="space-y-6">
          <div className={cx("custom-form")}>
            {codeotp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onFocus={(e) => e.target.select()}
                className={cx("custom-input")}
              />
            ))}
          </div>
          <div className={cx("submit-btn")}>
            <button
              type="submit"
              onClick={handleSubmit}
              className={cx("app-btn")}
            >
              {loadingverify ? (
                <div className={cx("spinner-border text-light")}></div>
              ) : (
                "Xác nhận OTP"
              )}
            </button>
            <button
              type="button"
              onClick={resendSubmit}
              className={cx("app-btn")}
            >
              {loadingresend ? (
                <div className={cx("spinner-border text-light")}></div>
              ) : (
                "Gửi lại OTP"
              )}
            </button>
          </div>
        </form>
      </div>
      {message && (
        <div
          className={`${cx("app-message")}  
                      ${
                        success === false
                          ? cx("app-message__err")
                          : cx("app-message__ok")
                      } ${fadeOut ? cx("fade-out") : ""}`}
        >
          {message}
        </div>
      )}
    </div>
  );
}

export default Otp;
