import { useState } from "react";
import { SignUp } from "../../../services/User/SignUp";
import styles from "./FormSignUp.module.css";
import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const cx = classNames.bind(styles);

function FormSignUp({ setMessage, setSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    checkpassword: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Gọi API đăng ký ở đây, ví dụ:
    try {
      setLoading(true); // bật trạng thái loading
      const data = await SignUp(
        formData.name,
        formData.email,
        formData.password,
        formData.checkpassword
      );
      setMessage(data.message);
      setSuccess(data.success);
      if (data.success === true)
        navigate("/otp", { state: { email: formData.email } });
      // Hiển thị thông báo thành công hoặc chuyển trang tại đây
    } catch (error) {
      console.error("API error:", error.message);
      setMessage(error.message);
      setSuccess(false);
      // Hiển thị thông báo lỗi cho người dùng tại đây
    } finally {
      setLoading(false); // tắt trạng thái loading
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showComfimPassword, setComfimShowPassword] = useState(false);

  return (
    <div className={cx("custom-container")}>
      {/* form đăng ký */}
      <div className={cx("card", "shadow", "p-5", "app-form")}>
        <form onSubmit={handleSubmit}>
          <h2 className={cx("app-title", "text-center", "mb-4")}>Đăng Ký</h2>
          <div className={cx("mb-3", "input-group")}>
            <label className={cx("form-label")}>Username</label>
            <div className={cx("boder-input")}>
              <input
                type="text"
                name="name"
                placeholder="UserName"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className={cx("mb-3", "input-group")}>
            <label className={cx("form-label")}>Email</label>
            <div className={cx("boder-input")}>
              <input
                placeholder="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className={cx("mb-3", "input-group")}>
            <label className={cx("form-label")}>Password</label>
            <div className={cx("boder-input")}>
              <input
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
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
            <label className={cx("form-label")}>Confirm password</label>
            <div className={cx("boder-input")}>
              <input
                placeholder="Confirm password"
                type={showComfimPassword ? "text" : "password"}
                name="checkpassword"
                value={formData.checkpassword}
                onChange={handleChange}
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
          <button
            className={cx("app-btn", "signup-btn")}
            type="submit"
            style={{ marginTop: 10 }}
          >
            {loading ? (
              <div className={cx("spinner-border text-light")}></div>
            ) : (
              "Đăng ký"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default FormSignUp;
