import { useState } from "react";
import { Login } from "../../../services/User/Login";
import styles from "../FormSignUp/FormSignUp.module.css";
import classNames from "classnames/bind";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
// để lưu user vào redux
import { useDispatch } from "react-redux";
import { setUser } from "../../../redux/userSlice";
import { Link } from "react-router-dom";
import { resendOTP } from "../../../services/User/resendOTP";

const cx = classNames.bind(styles);

function FormLogin({ setMessage, setSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Gọi API đăng ký ở đây, ví dụ:
    try {
      setLoading(true); // bật trạng thái loading
      const data = await Login(formData.email, formData.password);
      if (data.success === false) {
        setMessage(data.message);
        setSuccess(false);
        return;
      }
      if (data.user.isVerified === false) {
        setMessage("Vui lòng xác thực tài khoản");
        setSuccess(false);
        await resendOTP(formData.email);
        navigate("/otp", { state: { email: formData.email } });
        return;
      }
      dispatch(setUser({ user: data.user, token: data.token }));
      // lưu vào localStorage để giữ đăng nhập sau reload
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      navigate("/home");
      setMessage(data.message);
      setSuccess(data.success);
    } catch (error) {
      console.error("API error:", error.message);
      setMessage(error.message);
      setSuccess(false);
    } finally {
      setLoading(false); // tắt trạng thái loading
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={cx("custom-container")}>
      {/* form đăng ký */}
      <div className={cx("card", "shadow", "p-5", "app-form")}>
        <form onSubmit={handleSubmit}>
          <h2 className={cx("app-title", "text-center", "mb-4")}>Đăng Nhập</h2>
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
          <button
            className={cx("app-btn", "signup-btn")}
            type="submit"
            style={{ marginTop: 10 }}
          >
            {loading ? (
              <div className={cx("spinner-border text-light")}></div>
            ) : (
              "Đăng nhập"
            )}
          </button>
          <Link to="/forget-password" className={cx("forgot-password-link")}>
            Quên mật khẩu?
          </Link>
        </form>
      </div>
    </div>
  );
}

export default FormLogin;
