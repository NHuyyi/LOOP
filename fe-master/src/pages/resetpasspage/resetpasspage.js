import { useState, useEffect } from "react";
import styles from "./resetpasspage.module.css";
import classNames from "classnames/bind";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { resetpassword } from "../../services/User/resetpassword";

const cx = classNames.bind(styles);

function Reset() {
  const location = useLocation();
  const email = location.state?.email;
  const [password, setPassword] = useState("");
  const [comfimPassword, setComfimPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [fadeOut, setFadeOut] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showComfimPassword, setComfimShowPassword] = useState(false);

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

  const handlesubmit = async (e) => {
    e.preventDefault();
    // Gọi API đăng ký ở đây, ví dụ:
    try {
      setLoading(true); // bật trạng thái loading
      const data = await resetpassword(email, password, comfimPassword);
      console.log("email:", email);
      console.log("password:", password);
      console.log("comfimPassword:", comfimPassword);
      setMessage(data.message);
      setSuccess(data.success);
      if (data.success === true) navigate("/");
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
      <div className={cx("reset-container")}>
        <h2 className={cx("app-title")}>Cập nhật lại mật khẩu</h2>

        <div className={cx("mb-3", "input-group")}>
          <label className={cx("form-label")}>New Password</label>
          <div className={cx("boder-input")}>
            <input
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={cx("custom-input")}
            />
          </div>
          <button
            type="button"
            className={cx("show-btn")}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <div className={cx("mb-3", "input-group")}>
          <label className={cx("form-label")}>Confirm New password</label>
          <div className={cx("boder-input")}>
            <input
              placeholder="Confirm password"
              type={showComfimPassword ? "text" : "password"}
              name="comfimPassword"
              value={comfimPassword}
              onChange={(e) => setComfimPassword(e.target.value)}
              required
              className={cx("custom-input")}
            />
          </div>
          <button
            type="button"
            className={cx("show-btn")}
            onClick={() => setComfimShowPassword(!showComfimPassword)}
          >
            {showComfimPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <button onClick={handlesubmit} className={cx("app-btn")}>
          {loading ? (
            <div className={cx("spinner-border text-light")}></div>
          ) : (
            "Xác nhận"
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
  );
}

export default Reset;
