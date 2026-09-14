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
const authorize = require("../middleware/authorize");
const Authorization = require("../middleware/Authorization");

router.post("/signup", SignUp.SignUp); // Đăng ký người dùng
router.post("/verify-otp", verifyOTP.verifyOTP); // Xác thực OTP
router.post("/resend-otp", resendOTP.resendOTP); // Gửi lại OTP
router.post("/login", Login.Login); // Đăng nhập
router.post("/forget", forgetPassword.forgetPassword); // quên mật khẩu
router.post("/reset", resetpassword.resetpassword); // đặt lại mật khẩu
router.post("/getUserById",Authorization, authorize("user"), getUserById.getUserById); // Lấy thông tin người dùng theo ID
router.post("/toggle-block",Authorization, authorize("user"), toggleBlockUser.toggleBlockUser);
router.get(
  "/check-block/:targetId",
  Authorization, authorize("user"),
  checkBlockStatus.checkBlockStatus,
);
router.get("/blocked-list", Authorization, authorize("user"), getBlockList.getBlockList);
router.post("/update-profile", Authorization, authorize("user"), updateProfile.updateProfile);
router.post("/verify-old-password",Authorization, authorize("user"), verifyOldPassword.verifyOldPassword);
router.post("/request-change-password",Authorization, authorize("user"), requestChangePassword.requestChangePassword);
router.post("/update-privacy", Authorization, authorize("user"), updatePrivacy.updatePrivacy);
router.post("/deactivate",Authorization, authorize("user"), deactivateAccount.deactivateAccount);
router.post("/request-reactivate", requestReactivate.requestReactivate);
module.exports = router;
