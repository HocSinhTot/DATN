package JAVA6.admins.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;

import JAVA6.Model.UserModel;
import JAVA6.repository.UsersRepository;
import JAVA6.service.UserService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
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
    public ResponseEntity<String> createUser(
            @RequestPart("user") String userJson,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            UserModel user = mapper.readValue(userJson, UserModel.class);

            // Kiểm tra dữ liệu hợp lệ
            if (user.getUsername() == null || user.getUsername().isEmpty()) {
                return ResponseEntity.badRequest().body("Username is required.");
            }
            if (user.getPassword() == null || user.getPassword().isEmpty()) {
                return ResponseEntity.badRequest().body("Password is required.");
            }
            if (user.getEmail() == null || user.getEmail().isEmpty()) {
                return ResponseEntity.badRequest().body("Email is required.");
            }

            // Xử lý upload file nếu có
            if (file != null && !file.isEmpty()) {
                // Định nghĩa thư mục lưu trữ ảnh trong thư mục "static"
                String uploadDir = "src/main/resources/static/assets/images/U/";

                // Sử dụng `Path` để xử lý đường dẫn và đảm bảo thư mục tồn tại
                Path uploadPath = Paths.get(uploadDir);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath); // Tạo thư mục nếu không tồn tại
                }

                // Lấy tên tệp gốc
                String originalFileName = file.getOriginalFilename();

                // Đặt đường dẫn đầy đủ đến tệp sẽ lưu
                Path filePath = uploadPath.resolve(originalFileName);

                // Sao chép tệp vào thư mục
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                // Lưu tên hình ảnh vào cơ sở dữ liệu (relative path)
                user.setImage("assets/images/U/" + originalFileName);
            } else {
                user.setImage("assets/images/default_user_image.jpg"); // Sử dụng ảnh mặc định nếu không tải lên
            }

            // Mặc định vai trò là người dùng nếu không được chỉ định
            user.setRole(user.isRole() != false && user.isRole());

            // Lưu thông tin người dùng vào cơ sở dữ liệu
            usersRepository.save(user);
            return ResponseEntity.ok("User (or customer) created successfully.");
        } catch (IOException e) {
            logger.error("Error processing request: ", e);
            return ResponseEntity.status(500).body("Error creating user: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateUser(
            @PathVariable("id") int id,
            @RequestPart("user") String userJson,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        logger.info("Updating user with ID: {}", id);

        try {
            // Chuyển đổi JSON thành đối tượng UserModel
            ObjectMapper mapper = new ObjectMapper();
            UserModel user = mapper.readValue(userJson, UserModel.class);

            return usersRepository.findById(id)
                    .map(existingUser -> {
                        // Giữ nguyên mật khẩu nếu không thay đổi
                        if (user.getPassword() == null || user.getPassword().isEmpty()) {
                            user.setPassword(existingUser.getPassword());
                        }

                        // Xử lý upload ảnh mới
                        if (file != null && !file.isEmpty()) {
                            try {
                                String uploadDir = "assets/images/U/";
                                Path uploadPath = Paths.get(uploadDir);

                                if (!Files.exists(uploadPath)) {
                                    Files.createDirectories(uploadPath);
                                }

                                // Sử dụng tên file độc nhất
                                String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                                Path filePath = uploadPath.resolve(fileName);
                                Files.copy(file.getInputStream(), filePath);

                                // Cập nhật đường dẫn ảnh, bao gồm thư mục 'U'
                                user.setImage("U/U/" + fileName);
                            } catch (IOException e) {
                                logger.error("Error uploading file: ", e);
                                return ResponseEntity.status(500).body("Error uploading file: " + e.getMessage());
                            }
                        } else {
                            user.setImage(existingUser.getImage()); // Giữ ảnh cũ nếu không tải lên
                        }

                        // Cập nhật thông tin khác
                        user.setId(id); // Đảm bảo ID được giữ nguyên
                        usersRepository.save(user);
                        return ResponseEntity.ok("User updated successfully.");
                    })
                    .orElse(ResponseEntity.notFound().build()); // Trả về 404 nếu không tìm thấy user
        } catch (IOException e) {
            logger.error("Error processing request: ", e);
            return ResponseEntity.status(500).body("Error updating user: " + e.getMessage());
        }
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