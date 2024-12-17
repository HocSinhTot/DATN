package JAVA6.accounts.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import JAVA6.Model.UserModel;
import JAVA6.repository.UsersRepository;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class changeController {

    @Autowired
    private UsersRepository usersRepository;
    @Autowired
private PasswordEncoder passwordEncoder;

    @PostMapping("/change")
    public ApiResponse changePassword(@RequestBody ChangePasswordRequest changePasswordRequest) {
        String username = changePasswordRequest.getUsername();

        if (username == null || username.isEmpty()) {
            return new ApiResponse(false, "Username không hợp lệ.");
        }

        // Tìm người dùng theo username
        List<UserModel> users = usersRepository.findByUsername(username);

        if (users.isEmpty()) {
            return new ApiResponse(false, "Người dùng không tồn tại.");
        }

        UserModel user = users.get(0);

        // Kiểm tra mật khẩu hiện tại
        if (!passwordEncoder.matches(changePasswordRequest.getCurrentPassword(), user.getPassword())) {
            return new ApiResponse(false, "Mật khẩu hiện tại không trùng khớp.");
        }

        // Kiểm tra mật khẩu mới và xác nhận mật khẩu
        if (!changePasswordRequest.getNewPassword().equals(changePasswordRequest.getConfirmPassword())) {
            return new ApiResponse(false, "Mật khẩu mới và xác nhận mật khẩu không khớp.");
        }

        // Mã hóa mật khẩu mới và lưu lại
        user.setPassword(passwordEncoder.encode(changePasswordRequest.getNewPassword()));
        usersRepository.saveAndFlush(user);

        return new ApiResponse(true, "Mật khẩu đã được thay đổi thành công.");
    }

    public static class ChangePasswordRequest {
        private String username;
        private String currentPassword;
        private String newPassword;
        private String confirmPassword;

        // Getters and Setters
        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getCurrentPassword() {
            return currentPassword;
        }

        public void setCurrentPassword(String currentPassword) {
            this.currentPassword = currentPassword;
        }

        public String getNewPassword() {
            return newPassword;
        }

        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }

        public String getConfirmPassword() {
            return confirmPassword;
        }

        public void setConfirmPassword(String confirmPassword) {
            this.confirmPassword = confirmPassword;
        }
    }

    public static class ApiResponse {
        private boolean success;
        private String message;

        public ApiResponse(boolean success, String message) {
            this.success = success;
            this.message = message;
        }

        // Getters and Setters
        public boolean isSuccess() {
            return success;
        }

        public void setSuccess(boolean success) {
            this.success = success;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}
