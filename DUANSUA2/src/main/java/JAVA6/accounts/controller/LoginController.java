package JAVA6.accounts.controller;

import JAVA6.Model.UserModel;
import JAVA6.Request.LoginRequest;
import JAVA6.Response.ApiResponse;
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
                        .body(new ApiResponse(false, "Tài khoản đã bị khóa.", false, 0));
            }

            // Kiểm tra mật khẩu
            if (user.getPassword().equals(password)) {
                // Trả về thông tin người dùng dưới dạng API Response
                boolean isAdmin = user.isRole(); // Kiểm tra quyền admin
                int userId = user.getId();
                return ResponseEntity.ok(new ApiResponse(true, "Đăng nhập thành công!", isAdmin, userId));
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse(false, "Sai mật khẩu.", false, 0));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, "Tài khoản không tồn tại.", false, 0));
    }

    @RequestMapping("/logout")
    public ResponseEntity<ApiResponse> logout(HttpSession session, HttpServletResponse response) {
        // Ghi lại thông tin phiên người dùng trước khi hủy
        System.out.println("Session trước khi hủy: " + session.getId());

        // Hủy phiên người dùng để xóa dữ liệu liên quan
        session.invalidate();

        // Ghi lại thông tin phiên người dùng sau khi hủy
        System.out.println("Session sau khi hủy: " + session.getId());

        // Tùy chọn: xóa cookie (nếu bạn đang sử dụng cookie để lưu trữ phiên hoặc dữ
        // liệu remember-me)
        Cookie logoutCookie = new Cookie("JSESSIONID", null);
        logoutCookie.setMaxAge(0); // Đặt cookie hết hạn ngay lập tức
        logoutCookie.setPath("/"); // Đảm bảo cookie áp dụng cho toàn bộ domain
        response.addCookie(logoutCookie);

        // Trả về phản hồi xác nhận đăng xuất thành công
        return ResponseEntity.ok(new ApiResponse(true, "Đăng xuất thành công!", true, 0));
    }
}
