// Otp.js
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOTP } from "../../services/User/verifyOTP";
import { resendOTP } from "../../services/User/resendOTP";
// để lưu user vào redux
import { useDispatch } from "react-redux";
import { setUser, setNotiSettings } from "../../redux/userSlice";
import classNames from "classnames/bind";
import styles from "./verifyOTPPage.module.css";
import { getSettingsSounds } from "../../services/notifications/getNotiSettings";

import Loading from "../../component/Loading/Loading";
import { useToast } from "../../context/ToastContext";
const cx = classNames.bind(styles);

function Otp() {
  const location = useLocation();
  const email = location.state?.email || "";
  const otpType = location.state?.type || "signup";
  const password = location.state?.password || "";
  const [codeotp, setCodeOtp] = useState(new Array(6).fill(""));
  const [loadingverify, setLoadingverify] = useState(false);
  const [loadingresend, setLoadingresend] = useState(false);
  const toast = useToast();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const otp = codeotp.join("");
      setLoadingverify(true);
      const data = await verifyOTP(email, password, otp);
      
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }

      if (data.otptype === "signup") {
        dispatch(setUser({ user: data.user, token: data.token }));
        // lưu vào localStorage để giữ đăng nhập sau reload
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        try {
          const notiRes = await getSettingsSounds();
          if (notiRes.success && notiRes.data) {
            dispatch(setNotiSettings(notiRes.data));
          }
        } catch (error) {
          console.error("Lỗi lấy âm thanh khi đăng nhập:", error);
        }
        navigate("/home");
      }
      if (data.otptype === "reactivate") {
        dispatch(setUser({ user: data.user, token: data.token }));
        localStorage.setItem("userData", JSON.stringify({ user: data.user, token: data.token }));
        localStorage.setItem("token", data.token);
        try {
          const notiRes = await getSettingsSounds();
          if (notiRes.success && notiRes.data) {
            dispatch(setNotiSettings(notiRes.data));
          }
        } catch (error) {
          console.error("Lỗi lấy âm thanh khi đăng nhập:", error);
        }
        navigate("/home");
      }
      if (data.otptype === "2fa") {
        dispatch(setUser({ user: data.user, token: data.token }));
        localStorage.setItem("userData", JSON.stringify({ user: data.user, token: data.token }));
        try {
          const notiRes = await getSettingsSounds();
          if (notiRes.success && notiRes.data) {
            dispatch(setNotiSettings(notiRes.data));
          }
        } catch (error) {
          console.error("Lỗi lấy âm thanh khi đăng nhập:", error);
        }
        if (data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      }
      if (data.otptype === "reset") {
        navigate("/reset-password", { state: { email: email } });
      }
      if (data.otptype === "change") {
        navigate("/", { state: { email: email } });
      }
    } catch (error) {
      console.error("API error:", error.message);
      toast.error(error.message);
    } finally {
      setLoadingverify(false);
    }
  };

  const resendSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoadingresend(true);
      const resuit = await resendOTP(email, otpType);
      if (resuit.success){
        toast.success(resuit.message)
      }
      else{
        toast.error(resuit.message)
      }
    } catch (error) {
      console.error("API error:", error.message);
      toast.error(error.message);
    } finally {
      setLoadingresend(false);
      codeotp.fill("");
      document.getElementById("otp-input-0").focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Nếu phím bấm là Backspace VÀ ô hiện tại đang trống rỗng
    if (e.key === "Backspace" && e.target.value === "") {
      // Nhảy lùi về ô trước đó (nếu không phải là ô đầu tiên)
      if (index > 0) {
        const prevInput = document.getElementById(`otp-input-${index - 1}`);
        if (prevInput) {
          prevInput.focus();
        }
      }
    }
  };

  // Xử lý sự kiện dán (Paste)
  const handlePaste = (e) => {
    e.preventDefault(); // Ngăn hành vi dán mặc định của trình duyệt vào 1 ô

    // Lấy văn bản người dùng vừa copy/dán
    const pastedData = e.clipboardData.getData("text");

    // Lọc bỏ khoảng trắng và các ký tự không phải là số, chỉ lấy đúng 6 số đầu tiên
    const pastedNumbers = pastedData.replace(/\D/g, "").slice(0, 6);

    if (pastedNumbers.length > 0) {

      const newCodeOtp = [...codeotp];
      for (let i = 0; i < newCodeOtp.length; i++) {
        newCodeOtp[i] = pastedNumbers[i] || "";
      }
      setCodeOtp(newCodeOtp);

      const nextFocusIndex = Math.min(pastedNumbers.length, 5);
      const nextInput = document.getElementById(`otp-input-${nextFocusIndex}`);
      if (nextInput) {
        nextInput.focus();
      }
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
                id={`otp-input-${index}`}
                autoFocus={index === 0}
                type="text"
                maxLength="1"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onFocus={(e) => e.target.select()}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
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
              {loadingverify ? <Loading size="small" /> : "Xác nhận OTP"}
            </button>
            <button
              type="button"
              onClick={resendSubmit}
              className={cx("app-btn")}
            >
              {loadingresend ? <Loading size="small" /> : "Gửi lại OTP"}
            </button>
          </div>
        </form>
      </div>
      
    </div>
  );
}

export default Otp;
