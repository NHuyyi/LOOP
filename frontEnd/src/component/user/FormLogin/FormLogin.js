import { useState } from "react";
import { Login } from "../../../services/User/Login";
import { requestReactivateAPI } from "../../../services/User/requestReactivate";
import styles from "../FormSignUp/FormSignUp.module.css";
import classNames from "classnames/bind";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../../redux/userSlice";
import { resendOTP } from "../../../services/User/resendOTP";
import Loading from "../../Loading/Loading";
import ConfirmModal from "../../common/ConfirmModal/ConfirmModal";

const cx = classNames.bind(styles);

function FormLogin({ setMessage, setSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let data = await Login(formData.email, formData.password);

      if (data.isDeactivated) {
        setShowRestoreModal(true); // Chỉ cần set true để mở modal
        setLoading(false);
        return;
      }

      if (data.success === false) {
        setMessage(data.message);
        setSuccess(false);
        setLoading(false);
        return;
      }

      if (data.requires2FA) {
        setMessage(data.message);
        setSuccess(true);
        setTimeout(() => {
          navigate("/otp", { state: { email: formData.email, type: "2fa" } });
        }, 1000);
        return;
      }

      if (data.user.isVerified === false) {
        setMessage("Vui lòng xác thực tài khoản");
        setSuccess(false);
        await resendOTP(formData.email, "signup");
        navigate("/otp", { state: { email: formData.email, type: "signup" } });
        return;
      }

      dispatch(setUser({ user: data.user, token: data.token }));
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
      setLoading(false);
    }
  };

  const handleConfirmRestore = async () => {
    setLoading(true); // Đặt loading = true để ConfirmModal hiện icon xoay tròn
    const data = await requestReactivateAPI(formData.email, formData.password);

    if (data.success) {
      setMessage(data.message);
      setSuccess(true);
      setShowRestoreModal(false); // Đóng modal khi thành công
      setTimeout(() => {
        navigate("/otp", { state: { email: formData.email, type: "reactivate", password: formData.password } });
      }, 1500);
    } else {
      setMessage(data.message);
      setSuccess(false);
    }
    setLoading(false);
  };
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
            {loading ? <Loading size="small" /> : "Đăng nhập"}
          </button>
          <Link to="/forget-password" className={cx("forgot-password-link")}>
            Quên mật khẩu?
          </Link>
        </form>
      </div>
      <ConfirmModal
        isOpen={showRestoreModal}
        onClose={() => setShowRestoreModal(false)}
        onConfirm={handleConfirmRestore}
        title="Tài khoản vô hiệu hóa"
        message="Tài khoản của bạn hiện đang bị vô hiệu hóa. Bạn có muốn nhận mã OTP qua email để khôi phục và tiếp tục sử dụng không?"
        isProcessing={loading}
      />
    </div>
  );
}



export default FormLogin;
