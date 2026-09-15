import { useState } from "react";
import styles from "./forgetpassspage.module.css";
import classNames from "classnames/bind";
import { forgetpassword } from "../../services/User/forgetpassword";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";

import Loading from "../../component/Loading/Loading";

const cx = classNames.bind(styles);

function Forget() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendOTP(e);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    // Gọi API đăng ký ở đây, ví dụ:
    try {
      setLoading(true); // bật trạng thái loading
      const data = await forgetpassword(email);
      if(data.success){
        toast.success(data.message)
      }
      else{
        toast.error(data.message)
      }
      if (data.success === true) navigate("/otp", { state: { email: email } });
    } catch (error) {
      console.error("API error:", error.message);
      toast.error(error.message)
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
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSendOTP} className={cx("app-btn")}>
            {loading ? <Loading size="small" /> : "Gửi OTP"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Forget;
