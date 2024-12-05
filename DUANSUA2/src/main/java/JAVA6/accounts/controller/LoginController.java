package JAVA6.accounts.controller;

import JAVA6.Model.UserModel;
import JAVA6.Request.LoginRequest;
import JAVA6.ApiResponse.ApiResponse;
import JAVA6.repository.UsersRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class LoginController {

    @Autowired
    private UsersRepository usersRepository;

    // Đăng nhập và gửi thông tin người dùng về frontend
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();

        // Tìm người dùng theo username
        List<UserModel> users = usersRepository.findByUsername(username);

        if (!users.isEmpty()) {
            UserModel user = users.get(0);

            // Kiểm tra trạng thái tài khoản
            if (!user.isStatus()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new ApiResponse(false, "Tài khoản đã bị khóa.", false, 0, null));
            }

            // Kiểm tra mật khẩu
            if (user.getPassword().equals(password)) {
                boolean isAdmin = user.isRole(); // Kiểm tra quyền admin
                int userId = user.getId();

                // Chọn đường dẫn chuyển hướng dựa trên vai trò
                String redirectUrl = isAdmin ? "/admin" : "/user";

                // Trả về thông tin người dùng dưới dạng API Response
                return ResponseEntity.ok(new ApiResponse(true, "Đăng nhập thành công!", isAdmin, userId, redirectUrl));
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse(false, "Sai mật khẩu.", false, 0, null));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, "Tài khoản không tồn tại.", false, 0, null));
    }

    @RequestMapping("/logout")
    public ResponseEntity<ApiResponse> logout(HttpSession session, HttpServletResponse response) {
        // Ghi lại thông tin phiên người dùng trước khi hủy
        System.out.println("Session trước khi hủy: " + session.getId());

        // Hủy phiên người dùng để xóa dữ liệu liên quan
        session.invalidate();

        // Ghi lại thông tin phiên người dùng sau khi hủy
        System.out.println("Session sau khi hủy: " + session.getId());

        // Xóa cookie
        Cookie logoutCookie = new Cookie("JSESSIONID", null);
        logoutCookie.setMaxAge(0); // Đặt cookie hết hạn ngay lập tức
        logoutCookie.setPath("/"); // Áp dụng cho toàn bộ domain
        response.addCookie(logoutCookie);

        // Trả về phản hồi xác nhận đăng xuất thành công
        return ResponseEntity.ok(new ApiResponse(true, "Đăng xuất thành công!", true, 0, "/login"));
    }
}
