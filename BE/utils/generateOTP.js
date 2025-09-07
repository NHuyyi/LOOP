// hàm tạo mã OTP
function generateOTP() {
  let otp = "";
  for (let i = 0; i < 6; i++) {
    otp += Math.floor(Math.random() * 10).toString();
  }
  return otp;
}

module.exports = generateOTP;

// hàm sẽ random một mã OTP 6 chữ số
// và trả về dưới dạng chuỗi. Mã OTP này sẽ được sử dụng để xác thực người dùng trong quá trình đăng ký
// các chữ số trong mã OTP được tạo ngẫu nhiên từ 0 đến 9, và được nối lại thành một chuỗi 6 ký tự.
