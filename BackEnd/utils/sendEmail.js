// hàm gửi email

const nodemailer = require("nodemailer");

exports.sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: "LOOP ",
    to,
    subject,
    text,
  });
};

// hàm này sử dụng thư viện nodemailer để gửi email.
// Nó tạo một transporter với thông tin đăng nhập email từ biến môi trường,
// sau đó sử dụng phương thức sendMail để gửi email với địa chỉ người nhận, tiêu đề và nội dung.
// người nhận, tiêu đề và nội dung của email được truyền vào hàm sendEmail khi dùng.
