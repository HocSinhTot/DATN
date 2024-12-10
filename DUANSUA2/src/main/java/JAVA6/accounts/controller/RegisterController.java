package JAVA6.accounts.controller;

import JAVA6.Model.UserModel;
import JAVA6.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.sql.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class RegisterController {

    @Autowired
    private UsersRepository usersRepository;

    @PostMapping("/register")
    public ResponseEntity<?> handleRegister(@RequestBody Map<String, String> registerRequest) {
        Map<String, String> response = new HashMap<>();

        // Kiểm tra username, email hoặc phone đã tồn tại
        String username = registerRequest.get("username");
        String email = registerRequest.get("email");
        String phone = registerRequest.get("phone");
        String password = registerRequest.get("password");
        String confirmPassword = registerRequest.get("confirmPassword");

        if (usersRepository.existsByUsername(username)) {
            response.put("error", "Tên người dùng đã tồn tại");
            return ResponseEntity.badRequest().body(response);
        }
        if (usersRepository.existsByEmail(email)) {
            response.put("error", "Email đã tồn tại");
            return ResponseEntity.badRequest().body(response);
        }
        if (usersRepository.existsByPhone(phone)) {
            response.put("error", "Số điện thoại đã tồn tại");
            return ResponseEntity.badRequest().body(response);
        }
        if (!password.equals(confirmPassword)) {
            response.put("error", "Mật khẩu và xác nhận mật khẩu không khớp nhau.");
            return ResponseEntity.badRequest().body(response);
        }

        // Tạo và lưu user mới
        UserModel newUser = new UserModel();
        newUser.setUsername(username);
        newUser.setPassword(password);
        newUser.setEmail(email);
        newUser.setPhone(phone);
        newUser.setName(username); // Giả định `name` giống `username`
        newUser.setBirthday(Date.valueOf(registerRequest.get("dob")));
        newUser.setRole(false); // Set default role
        newUser.setImage("defautlt.jpg");
        newUser.setStatus(true);
        usersRepository.saveAndFlush(newUser);

        // Phản hồi thành công
        response.put("success", "Đăng ký thành công! Vui lòng đăng nhập.");
        return ResponseEntity.ok(response);
    }
}
