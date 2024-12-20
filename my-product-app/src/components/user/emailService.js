// emailService.js (ví dụ)
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // Hoặc dịch vụ email khác
  auth: {
    user: 'your-email@example.com', // Email của bạn
    pass: 'your-password', // Mật khẩu email của bạn
  },
});

const sendCancellationEmail = (userEmail) => {
  const mailOptions = {
    from: 'your-email@example.com',
    to: userEmail,
    subject: 'Thông báo hủy đơn hàng',
    text: 'Đơn hàng của bạn đã được hủy thành công.',
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendCancellationEmail };