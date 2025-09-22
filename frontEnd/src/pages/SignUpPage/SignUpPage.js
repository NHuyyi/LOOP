import { useState, useEffect } from "react";
import FormSignUp from "../../component/user/FormSignUp/FormSignUp";
import styles from "./SignUpPage.module.css";
import classNames from "classnames/bind";
import logo from "../../img/logo.png";
import FormLogin from "../../component/user/FormLogin/FormLogin";
const cx = classNames.bind(styles);

function SignUpPage() {
  const [showformsignup, setShowformsignup] = useState(true);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(" ");
  const [fadeOut, setFadeOut] = useState(false);

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
  return (
    <div className={cx("custom-container")}>
      <div className={cx("custom-half")}>
        {showformsignup ? (
          <FormSignUp setMessage={setMessage} setSuccess={setSuccess} />
        ) : (
          <FormLogin setMessage={setMessage} setSuccess={setSuccess} />
        )}
      </div>
      <div className={cx("custom-half-action")}>
        <button
          className={cx("app-btn", "login-btn")}
          onClick={() => setShowformsignup(!showformsignup)}
        >
          {showformsignup ? "Đăng nhập" : "Đăng ký"}
        </button>
        <button className={cx("app-btn", "google-btn")}>
          <span>
            <svg
              enableBackground="new 0 0 128 128"
              id="Social_Icons"
              version="1.1"
              viewBox="0 0 128 128"
              className={cx("app-icon")}
            >
              <g id="_x31__stroke">
                <g id="Google">
                  <rect
                    clipRule="evenodd"
                    fill="none"
                    fillRule="evenodd"
                    height="128"
                    width="128"
                  />
                  <path
                    clipRule="evenodd"
                    d="M27.585,64c0-4.157,0.69-8.143,1.923-11.881L7.938,35.648    C3.734,44.183,1.366,53.801,1.366,64c0,10.191,2.366,19.802,6.563,28.332l21.558-16.503C28.266,72.108,27.585,68.137,27.585,64"
                    fill="#FBBC05"
                    fillRule="evenodd"
                  />
                  <path
                    clipRule="evenodd"
                    d="M65.457,26.182c9.031,0,17.188,3.2,23.597,8.436L107.698,16    C96.337,6.109,81.771,0,65.457,0C40.129,0,18.361,14.484,7.938,35.648l21.569,16.471C34.477,37.033,48.644,26.182,65.457,26.182"
                    fill="#EA4335"
                    fillRule="evenodd"
                  />
                  <path
                    clipRule="evenodd"
                    d="M65.457,101.818c-16.812,0-30.979-10.851-35.949-25.937    L7.938,92.349C18.361,113.516,40.129,128,65.457,128c15.632,0,30.557-5.551,41.758-15.951L86.741,96.221    C80.964,99.86,73.689,101.818,65.457,101.818"
                    fill="#34A853"
                    fillRule="evenodd"
                  />
                  <path
                    clipRule="evenodd"
                    d="M126.634,64c0-3.782-0.583-7.855-1.457-11.636H65.457v24.727    h34.376c-1.719,8.431-6.397,14.912-13.092,19.13l20.474,15.828C118.981,101.129,126.634,84.861,126.634,64"
                    fill="#4285F4"
                    fillRule="evenodd"
                  />
                </g>
              </g>
            </svg>
          </span>
          Google
        </button>
        <button className={cx("app-btn", "facebook-btn")}>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
              className={cx("app-icon")}
            >
              <path
                fill="#3717d3"
                d="M576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 440 146.7 540.8 258.2 568.5L258.2 398.2L205.4 398.2L205.4 320L258.2 320L258.2 286.3C258.2 199.2 297.6 158.8 383.2 158.8C399.4 158.8 427.4 162 438.9 165.2L438.9 236C432.9 235.4 422.4 235 409.3 235C367.3 235 351.1 250.9 351.1 292.2L351.1 320L434.7 320L420.3 398.2L351 398.2L351 574.1C477.8 558.8 576 450.9 576 320z"
              />
            </svg>
          </span>
          Facebook
        </button>
      </div>
      {/* logo */}
      <div className={cx("custom-half", "custom-logo-half")}>
        <div className={cx("text-center")}>
          <h3 className={cx("app-title")}>Loop xin chào</h3>
          <div className={cx("image-logo")}>
            <img src={logo} alt="Logo" className={cx("app-logo", "mb-4")} />
          </div>
        </div>
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

export default SignUpPage;
