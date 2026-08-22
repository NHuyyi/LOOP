const express = require("express");
const router = express.Router();
const SignUp = require("../controller//users/SignUpController");
const verifyOTP = require("../controller/users/verifyOTP");
const resendOTP = require("../controller/users/resendOTP");
const Login = require("../controller/users/LoginController");
const forgetPassword = require("../controller/users/forgetPassword");
const resetpassword = require("../controller/users/resetpassword");
const getUserById = require("../controller/users/getUserbyId");
const toggleBlockUser = require("../controller/blocks/toggleBlockUser");
const checkBlockStatus = require("../controller/blocks/checkBlockStatus");
const getBlockList = require("../controller/blocks/getBlockList");
const updateProfile = require("../controller/users/updateProfile");
const requestChangePassword = require("../controller/users/requestChangePassword");
const verifyOldPassword = require("../controller/users/verifyOldPassword");
const updatePrivacy = require("../controller/users/updatePrivacy");
const deactivateAccount = require("../controller/users/deactivateAccount");
const requestReactivate = require("../controller/users/requestReactivate");
const authorize = require("../middleware/Authorization");

router.post("/signup", SignUp.SignUp); // Đăng ký người dùng
router.post("/verify-otp", verifyOTP.verifyOTP); // Xác thực OTP
router.post("/resend-otp", resendOTP.resendOTP); // Gửi lại OTP
router.post("/login", Login.Login); // Đăng nhập
router.post("/forget", forgetPassword.forgetPassword); // quên mật khẩu
router.post("/reset", resetpassword.resetpassword); // đặt lại mật khẩu
router.post("/getUserById", authorize, getUserById.getUserById); // Lấy thông tin người dùng theo ID
router.post("/toggle-block", authorize, toggleBlockUser.toggleBlockUser);
router.get(
  "/check-block/:targetId",
  authorize,
  checkBlockStatus.checkBlockStatus,
);
router.get("/blocked-list", authorize, getBlockList.getBlockList);
router.post("/update-profile", authorize, updateProfile.updateProfile);
router.post("/verify-old-password", authorize, verifyOldPassword.verifyOldPassword);
router.post("/request-change-password", authorize, requestChangePassword.requestChangePassword);
router.post("/update-privacy", authorize, updatePrivacy.updatePrivacy);
router.post("/deactivate", authorize, deactivateAccount.deactivateAccount);
router.post("/request-reactivate", requestReactivate.requestReactivate);
module.exports = router;
