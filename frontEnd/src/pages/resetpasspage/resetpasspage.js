import { useState } from "react";
import styles from "./resetpasspage.module.css";
import classNames from "classnames/bind";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { resetpassword } from "../../services/User/resetpassword";

import Loading from "../../component/Loading/Loading";
import { useToast } from "../../context/ToastContext";
const cx = classNames.bind(styles);

function Reset() {
  const location = useLocation();
  const toast = useToast();
  const email = location.state?.email;
  const [password, setPassword] = useState("");
  const [comfimPassword, setComfimPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showComfimPassword, setComfimShowPassword] = useState(false);

  const navigate = useNavigate();


  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handlesubmit(e);
    }
  };

  const handleNextFocus = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Ngăn không cho trang bị load lại (nếu có form)
      const nextInput = document.getElementById("confirm-password-input");
      if (nextInput) {
        nextInput.focus(); // Nhảy con trỏ chuột sang ô số 2
      }
    }
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    // Gọi API đăng ký ở đây, ví dụ:
    try {
      setLoading(true); // bật trạng thái loading
      const data = await resetpassword(email, password, comfimPassword);
      if (data.success){
        toast.success(data.message);
      }
      else{
        toast.error(data.message);
      }
      if (data.success === true) navigate("/");
    } catch (error) {
      console.error("API error:", error.message);
      toast.error(error.message);
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
              onKeyDown={handleNextFocus}
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
              id="confirm-password-input"
              placeholder="Confirm password"
              type={showComfimPassword ? "text" : "password"}
              name="comfimPassword"
              value={comfimPassword}
              onChange={(e) => setComfimPassword(e.target.value)}
              required
              onKeyDown={handleKeyDown}
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
          {loading ? <Loading size="small" /> : "Xác nhận"}
        </button>
      </div>
    </div>
  );
}

export default Reset;
