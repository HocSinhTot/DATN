package JAVA6.accounts.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Properties;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import JAVA6.Model.UserModel;
import JAVA6.repository.UsersRepository;
import jakarta.mail.Authenticator;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

@Controller
public class ForgotController {
    @Autowired
    private UsersRepository usersRepository;

    Map<String, String> mapOTP = new HashMap<>();
    @RequestMapping("/Forgot")
    public String forgotForm() {
        return "accounts/Forgot";
    }

    @PostMapping("/Forgot/otp")
    public ModelAndView otpForm(@RequestParam("email") String email, @RequestParam("otp") Optional<String> oOTP) {
        ModelAndView modelAndView = new ModelAndView();

        // Đặt view cho trang xác nhận OTP
        modelAndView.setViewName("accounts/otpFor");

        if (oOTP.isPresent()) {
            if (mapOTP.get(email).equals(oOTP.get())) {
                modelAndView.addObject("email", email);
                modelAndView.setViewName("accounts/xnfor");
            } else {
                modelAndView.addObject("error", "Mã OTP không trùng khớp.");
            }
            return modelAndView;
        }

        // Kiểm tra xem email có tồn tại trong cơ sở dữ liệu không
        List<UserModel> users = usersRepository.findByEmail(email);
        if (!users.isEmpty()) {
            String otp = generateOTP(); // Sinh mã OTP
            mapOTP.put(email, otp); // Lưu mã OTP vào map cùng với email để xác nhận

            // Gửi OTP qua email
            try {
                sendOtpEmail(email, otp);
                modelAndView.addObject("email", email);
                modelAndView.setViewName("accounts/otpFor");
                return modelAndView;
            } catch (MessagingException e) {
                modelAndView.setViewName("redirect:/Forgot?error=Không thể gửi email OTP");
                return modelAndView;
            }
        } else {
            modelAndView.setViewName("redirect:/Forgot?error=Email không tồn tại");
            return modelAndView;
        }
    }

    @GetMapping("/Forgot/otp/xn")
    public ModelAndView viewConfirmOtp() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("accounts/xnfor");
        return modelAndView;
    }

    @PostMapping("/Forgot/otp/xn")
    public ModelAndView confirmOtp(@RequestParam("email") String email,
            @RequestParam("newPassword") String newPassword,
            @RequestParam("confirmPassword") String confirmPassword) {
        ModelAndView modelAndView = new ModelAndView();

        if (!newPassword.equals(confirmPassword)) {
            modelAndView.addObject("error", "Mật khẩu mới và xác nhận mật khẩu không khớp nhau.");
            modelAndView.setViewName("redirect:/Forgot/otp/xn?email=" + email);
            return modelAndView;
        }

        List<UserModel> users = usersRepository.findByEmail(email);
        if (!users.isEmpty()) {
            UserModel user = users.get(0);
            user.setPassword(newPassword);
            usersRepository.save(user);

            modelAndView.setViewName("redirect:/login");
        } else {
            modelAndView.setViewName("redirect:/Forgot?error=Email không tồn tại");
        }

        return modelAndView;
    }

    private String generateOTP() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

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
        message.setSubject("OTP for Password Reset");
        message.setText("Your OTP for password reset is: " + otp);

        Transport.send(message);
    }
}
