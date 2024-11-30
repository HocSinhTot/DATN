package JAVA6.admins.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import JAVA6.Model.UserModel;
import JAVA6.repository.UsersRepository;
import JAVA6.service.UserService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UsersController {

    private static final Logger logger = LoggerFactory.getLogger(UsersController.class);

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private UserService userService;

    // Lấy danh sách tất cả người dùng
    @GetMapping
    public ResponseEntity<List<UserModel>> getAllUsers() {
        List<UserModel> users = usersRepository.findAll();
        if (users.isEmpty()) {
            return ResponseEntity.noContent().build(); // Trả về 204 nếu danh sách rỗng
        }
        return ResponseEntity.ok(users); // Trả về danh sách người dùng
    }

    // Lấy thông tin người dùng theo ID
    @GetMapping("/{id}")
    public ResponseEntity<UserModel> getUserById(@PathVariable("id") int id) {
        logger.info("Fetching user with ID: {}", id);
        return usersRepository.findById(id)
                .map(user -> {
                    logger.info("Found user: {}", user);
                    return ResponseEntity.ok(user);
                })
                .orElse(ResponseEntity.notFound().build()); // Trả về 404 nếu không tìm thấy
    }

    // Thêm người dùng mới hoặc khách hàng
    @PostMapping
    public ResponseEntity<String> createUser(@RequestPart("user") UserModel user,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        try {
            // Kiểm tra nếu tất cả dữ liệu người dùng là hợp lệ (validate dữ liệu)
            if (user.getUsername() == null || user.getUsername().isEmpty()) {
                return ResponseEntity.badRequest().body("Username is required.");
            }
            if (user.getPassword() == null || user.getPassword().isEmpty()) {
                return ResponseEntity.badRequest().body("Password is required.");
            }
            if (user.getEmail() == null || user.getEmail().isEmpty()) {
                return ResponseEntity.badRequest().body("Email is required.");
            }

            // Xử lý upload ảnh nếu có
            if (file != null && !file.isEmpty()) {
                String uploadDir = "src/main/resources/static/assets/images/uploads/";
                Path uploadPath = Paths.get(uploadDir);

                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                Path filePath = uploadPath.resolve(file.getOriginalFilename());
                Files.copy(file.getInputStream(), filePath);

                // Lưu đường dẫn ảnh vào user
                user.setImage("uploads/" + file.getOriginalFilename());
            } else {
                user.setImage("default_user_image.jpg"); // Nếu không upload ảnh
            }

            // Set default role to "customer" (false) if not specified
            if (user.isRole() == false) {
                user.setRole(false); // Default to "customer" (inactive)
            }

            usersRepository.save(user);
            return ResponseEntity.ok("User (or customer) created successfully.");
        } catch (IOException e) {
            logger.error("Error uploading file: ", e);
            return ResponseEntity.status(500).body("Error creating user: " + e.getMessage());
        }
    }

    // Cập nhật thông tin người dùng
    @PutMapping("/{id}")
    public ResponseEntity<String> updateUser(@PathVariable("id") int id,
            @RequestPart("user") UserModel user,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        logger.info("Updating user with ID: {}", id);

        return usersRepository.findById(id)
                .map(existingUser -> {
                    // Giữ nguyên mật khẩu nếu không thay đổi
                    if (user.getPassword() == null || user.getPassword().isEmpty()) {
                        user.setPassword(existingUser.getPassword());
                    }

                    // Xử lý upload ảnh mới
                    if (file != null && !file.isEmpty()) {
                        try {
                            String uploadDir = "src/main/resources/static/assets/images/uploads/";
                            Path uploadPath = Paths.get(uploadDir);

                            if (!Files.exists(uploadPath)) {
                                Files.createDirectories(uploadPath);
                            }

                            Path filePath = uploadPath.resolve(file.getOriginalFilename());
                            Files.copy(file.getInputStream(), filePath);

                            user.setImage("uploads/" + file.getOriginalFilename());
                        } catch (IOException e) {
                            logger.error("Error uploading file: ", e);
                            return ResponseEntity.status(500).body("Error uploading file: " + e.getMessage());
                        }
                    } else {
                        user.setImage(existingUser.getImage()); // Keep the old image if none is uploaded
                    }

                    user.setId(id);
                    usersRepository.save(user);
                    return ResponseEntity.ok("User updated successfully.");
                })
                .orElse(ResponseEntity.notFound().build()); // Trả về 404 nếu không tìm thấy user
    }

    // Xóa người dùng
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable("id") int id) {
        return usersRepository.findById(id)
                .map(user -> {
                    usersRepository.delete(user);
                    return ResponseEntity.ok("User deleted successfully.");
                })
                .orElse(ResponseEntity.notFound().build()); // Trả về 404 nếu không tìm thấy user
    }

    @PutMapping("/{id}/block")
    public ResponseEntity<String> blockUser(@PathVariable("id") int id) {
        return userService.blockUser(id);
    }

    @PutMapping("/{id}/unblock")
    public ResponseEntity<String> unblockUser(@PathVariable("id") int id) {
        return userService.unblockUser(id);
    }
}
