package JAVA6.accounts.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import JAVA6.Model.UserModel;
import JAVA6.repository.UsersRepository;

import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

import java.util.*;

@RestController
@RequestMapping("/api/forgot")
public class ForgotController {
  @Autowired
    private PasswordEncoder passwordEncoder; 
    @Autowired
    private UsersRepository usersRepository;

    private Map<String, String> mapOTP = new HashMap<>();

    // Gửi OTP tới email
    @PostMapping("/send-otp")
    public Map<String, Object> sendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        Map<String, Object> response = new HashMap<>();
        // Kiểm tra email trong cơ sở dữ liệu
        List<UserModel> users = usersRepository.findByEmail(email);
        if (users.isEmpty()) {
            response.put("success", false);
            response.put("message", "Email không tồn tại trong hệ thống.");
            return response;
        }

        // Sinh mã OTP
        String otp = generateOTP();
        mapOTP.put(email, otp);

        // Gửi OTP qua email
        try {
            sendOtpEmail(email, otp);
            response.put("success", true);
            response.put("message", "OTP đã được gửi tới email.");
        } catch (MessagingException e) {
            response.put("success", false);
            response.put("message", "Không thể gửi email OTP. Vui lòng thử lại.");
        }

        return response;
    }

    // Xác nhận OTP
    @PostMapping("/verify-otp")
    public Map<String, Object> verifyOtp(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        String email = request.get("email");
        String otp = request.get("otp");
        String savedOtp = mapOTP.get(email);
        if (savedOtp != null && savedOtp.equals(otp)) {
            response.put("success", true);
            response.put("message", "OTP xác nhận thành công.");
        } else {
            response.put("success", false);
            response.put("message", "OTP không hợp lệ hoặc đã hết hạn.");
        }

        return response;
    }

    // Đặt lại mật khẩu
    @PostMapping("/reset-password")
    public Map<String, Object> resetPassword(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        String email = request.get("email");
        String newPassword = request.get("newPassword");
        String confirmPassword = request.get("confirmPassword");

        if (!newPassword.equals(confirmPassword)) {
            response.put("success", false);
            response.put("message", "Mật khẩu mới và xác nhận mật khẩu không khớp.");
            return response;
        }

        List<UserModel> users = usersRepository.findByEmail(email);
        if (!users.isEmpty()) {
            UserModel user = users.get(0);
            String encodedPassword = passwordEncoder.encode(newPassword);
            user.setPassword(encodedPassword); // Lưu mật khẩu mới
            usersRepository.save(user);

            response.put("success", true);
            response.put("message", "Đặt lại mật khẩu thành công.");
        } else {
            response.put("success", false);
            response.put("message", "Email không tồn tại.");
        }

        return response;
    }

    // Sinh mã OTP
    private String generateOTP() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    // Gửi OTP qua email
    private void sendOtpEmail(String recipient, String otp) throws MessagingException {
        Properties properties = new Properties();
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.starttls.enable", "true");
        properties.put("mail.smtp.host", "smtp.gmail.com");
        properties.put("mail.smtp.port", "587");

        String email = "dinhlhpc05738@fpt.edu.vn";
        String password = "dllr oinc rovw jcvr";

        Session session = Session.getInstance(properties, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(email, password);
            }
        });

        Message message = new MimeMessage(session);
        message.setFrom(new InternetAddress(email));
        message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(recipient));
        message.setSubject("Quên mật khẩu");
        message.setText("Mã OTP để xác nhận quên mật khẩu là: " + otp);

        Transport.send(message);
    }
}
