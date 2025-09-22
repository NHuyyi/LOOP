// hàm kiểm tra xem OTP đã hết hạn hay chưa

function isOTPExpired(otpExpires) {
  const currentTime = new Date();
  return otpExpires < currentTime;
}

module.exports = isOTPExpired;
