const express = require("express");
const router = express.Router();
const SignUp = require("../controller//users/SignUpController");
const verifyOTP = require("../controller/users/verifyOTP");
const resendOTP = require("../controller/users/resendOTP");
const Login = require("../controller/users/LoginController");
const forgetPassword = require("../controller/users/forgetPassword");
const resetpassword = require("../controller/users/resetpassword");
const getUserById = require("../controller/users/getUserbyId");
const authorize = require("../middleware/Authorization");

router.post("/signup", SignUp.SignUp); // Đăng ký người dùng
router.post("/verify-otp", verifyOTP.verifyOTP); // Xác thực OTP
router.post("/resend-otp", resendOTP.resendOTP); // Gửi lại OTP
router.post("/login", Login.Login); // Đăng nhập
router.post("/forget", forgetPassword.forgetPassword); // quên mật khẩu
router.post("/reset", resetpassword.resetpassword); // đặt lại mật khẩu
router.post("/getUserById", authorize, getUserById.getUserById); // Lấy thông tin người dùng theo ID

module.exports = router;
