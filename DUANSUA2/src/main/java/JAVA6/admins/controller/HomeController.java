package JAVA6.admins.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

import jakarta.servlet.http.HttpSession;

@RestController // Đổi từ @Controller sang @RestController
public class HomeController {

    @Autowired
    private HttpSession session;

    // API Endpoint kiểm tra quyền truy cập admin
    // @GetMapping("/api/admin")
    // public ResponseEntity<String> checkAdminAccess() {
    //     // Kiểm tra session, nếu không có hoặc role không phải là admin
    //     Boolean isAdmin = (Boolean) session.getAttribute("role");
    //     if (isAdmin == null || !isAdmin) {
    //         // Trả về thông báo lỗi nếu không phải admin
    //         return ResponseEntity.status(403).body("Forbidden: Access is denied.");
    //     }
    //     // Trả về thông báo khi đã kiểm tra và là admin
    //     return ResponseEntity.ok("Welcome Admin!");
    // }
}
