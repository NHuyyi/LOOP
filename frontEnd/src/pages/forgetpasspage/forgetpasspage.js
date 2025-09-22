import { useState, useEffect } from "react";
import styles from "./forgetpassspage.module.css";
import classNames from "classnames/bind";
import { forgetpassword } from "../../services/User/forgetpassword";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

function Forget() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();

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

  const handleSendOTP = async (e) => {
    e.preventDefault();
    // Gọi API đăng ký ở đây, ví dụ:
    try {
      setLoading(true); // bật trạng thái loading
      const data = await forgetpassword(email);
      setMessage(data.message);
      setSuccess(data.success);
      if (data.success === true) navigate("/otp", { state: { email: email } });
    } catch (error) {
      console.error("API error:", error.message);
      setMessage(error.message);
      setSuccess(false);
    } finally {
      setLoading(false); // tắt trạng thái loading
    }
  };

  return (
    <div className={cx("app-container")}>
      <div className={cx("forgot-container")}>
        <h2 className={cx("app-title")}>Quên mật khẩu</h2>

        <div className={cx("form")}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSendOTP} className={cx("app-btn")}>
            {loading ? (
              <div className={cx("spinner-border text-light")}></div>
            ) : (
              "Gửi OTP"
            )}
          </button>
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
    </div>
  );
}

export default Forget;
