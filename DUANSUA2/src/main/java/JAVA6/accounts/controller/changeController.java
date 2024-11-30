package JAVA6.accounts.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import JAVA6.Model.UserModel;
import JAVA6.repository.UsersRepository;

@RestController
@RequestMapping("/api/auth")
public class changeController {

    @Autowired
    private UsersRepository usersRepository;

    @PostMapping("/change")
    public ApiResponse changePassword(@RequestBody ChangePasswordRequest changePasswordRequest) {
        // Lấy username từ yêu cầu
        String username = changePasswordRequest.getUsername();
    
        if (username == null || username.isEmpty()) {
            return new ApiResponse(false, "Username không hợp lệ.");
        }
    
        // Tìm người dùng theo username (trả về danh sách)
        List<UserModel> users = usersRepository.findByUsername(username);
    
        if (users.isEmpty()) {
            return new ApiResponse(false, "Người dùng không tồn tại.");
        }
    
        // Lấy người dùng đầu tiên trong danh sách
        UserModel user = users.get(0);
    
        // Kiểm tra mật khẩu hiện tại
        if (!user.getPassword().equals(changePasswordRequest.getCurrentPassword())) {
            return new ApiResponse(false, "Mật khẩu hiện tại không trùng khớp.");
        }
    
        // Kiểm tra mật khẩu mới và xác nhận mật khẩu
        if (!changePasswordRequest.getNewPassword().equals(changePasswordRequest.getConfirmPassword())) {
            return new ApiResponse(false, "Mật khẩu mới và xác nhận mật khẩu không khớp.");
        }
    
        // Cập nhật mật khẩu mới
        user.setPassword(changePasswordRequest.getNewPassword());
        usersRepository.saveAndFlush(user);
    
        return new ApiResponse(true, "Mật khẩu đã được thay đổi thành công.");
    }
     
    // Đối tượng yêu cầu thay đổi mật khẩu
    public static class ChangePasswordRequest {
        private String username;  // Tên người dùng
        private String currentPassword;
        private String newPassword;
        private String confirmPassword;
    
        // Getters and Setters
        public String getUsername() {  // Sửa lại getter và setter
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
    
    // Đối tượng phản hồi API
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
