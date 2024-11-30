package JAVA6.users.controller;

import java.io.File;
import java.io.IOException;
import java.util.Optional;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import JAVA6.Model.UserModel;
import JAVA6.repository.UsersRepository;

@RestController
@RequestMapping("/api/users")
public class AccountController {

    @Autowired
    UsersRepository userRepository;

    @GetMapping("/profile")
    public ResponseEntity<UserModel> getProfile(@RequestHeader("Username") String username) {
        // Kiểm tra giá trị username
        System.out.println("Username from request header: " + username);

        if (username == null) {
            return ResponseEntity.status(400).body(null); // Trả về lỗi nếu không có username
        }

        // Tìm người dùng theo username
        Optional<UserModel> user = userRepository.findByUsername(username).stream().findFirst();

        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).body(null)); // Không tìm thấy người dùng
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateUser(
        @RequestPart("user") UserModel user, // Nhận đối tượng user từ form data
        @RequestPart(value = "image", required = false) MultipartFile imageFile,  // Nhận file hình ảnh nếu có
        HttpSession session,
        HttpServletRequest request) {
        // Kiểm tra xem người dùng có tồn tại trong cơ sở dữ liệu không
        Optional<UserModel> existingUserOpt = userRepository.findById(user.getId());
        if (existingUserOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Không tìm thấy người dùng");
        }

        UserModel existingUser = existingUserOpt.get();

    

        // Cập nhật thông tin người dùng
        existingUser.setName(user.getName());
        existingUser.setUsername(user.getUsername());
        existingUser.setEmail(user.getEmail());
        existingUser.setBirthday(user.getBirthday());
        existingUser.setPhone(user.getPhone());
        existingUser.setGender(user.isGender());
        existingUser.setPassword(user.getPassword());
        existingUser.setRole(user.isRole());

        // Kiểm tra nếu có tệp hình ảnh được tải lên
        if (imageFile != null && !imageFile.isEmpty()) {
            String realPath = request.getServletContext().getRealPath("/");
            String uploadDirectory = "assets/images";
            String uploadPath = realPath + File.separator + uploadDirectory;

            // Tạo thư mục nếu chưa tồn tại
            File uploadDir = new File(uploadPath);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            // Tên file hình ảnh
            String imageFileName = imageFile.getOriginalFilename();
            File destination = new File(uploadPath + File.separator + imageFileName);

            try {
                imageFile.transferTo(destination);  // Chuyển tệp tải lên vào thư mục đích
                existingUser.setImage(imageFileName);  // Cập nhật tên hình ảnh
            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.status(500).body("Lỗi khi tải lên hình ảnh");
            }
        }

        // Lưu người dùng vào cơ sở dữ liệu
        userRepository.saveAndFlush(existingUser);

        // Cập nhật lại session
        session.setAttribute("id", existingUser.getId());
        session.setAttribute("name", existingUser.getName());
        session.setAttribute("username", existingUser.getUsername());
        session.setAttribute("email", existingUser.getEmail());
        session.setAttribute("birthday", existingUser.getBirthday());
        session.setAttribute("phone", existingUser.getPhone());
        session.setAttribute("gender", existingUser.isGender());
        session.setAttribute("image", existingUser.getImage());

        return ResponseEntity.ok("Thông tin người dùng đã được cập nhật thành công");
    }
}
