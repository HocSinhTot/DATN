package JAVA6.admins.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;

import JAVA6.Model.BrandModel;
import JAVA6.Model.CategoryModel;
import JAVA6.Model.ColorModel;
import JAVA6.Model.UserModel;
import JAVA6.repository.BrandRepository;
import JAVA6.repository.CategoryRepository;
import JAVA6.repository.ColorAdminRepository;
import JAVA6.repository.UsersRepository;
import JAVA6.service.BrandService;
import JAVA6.service.CategoryService;
import JAVA6.service.ColorService;
import JAVA6.service.UserService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/colors")
public class ColorController {

    private static final Logger logger = LoggerFactory.getLogger(ColorController.class);

    @Autowired
    private ColorAdminRepository colorAdminRepository;

    @Autowired
    private ColorService colorService;

    // Lấy danh sách tất cả người dùng
    @GetMapping
    public ResponseEntity<List<ColorModel>> getAllColor() {
        List<ColorModel> color = colorAdminRepository.findAll();
        if (color.isEmpty()) {
            return ResponseEntity.noContent().build(); // Trả về 204 nếu danh sách rỗng
        }
        return ResponseEntity.ok(color); // Trả về danh sách người dùng
    }

    // Lấy thông tin người dùng theo ID
    @GetMapping("/{id}")
    public ResponseEntity<ColorModel> getColorById(@PathVariable("id") int id) {
        logger.info("Fetching color with ID: {}", id);
        return colorAdminRepository.findById(id)
                .map(color -> {
                    logger.info("Found color: {}", color);
                    return ResponseEntity.ok(color);
                })
                .orElse(ResponseEntity.notFound().build()); // Trả về 404 nếu không tìm thấy
    }

    // Thêm người dùng mới hoặc khách hàng
@PostMapping
public ResponseEntity<String> createColor(
        @RequestPart("color") String colorJson) {
    try {
        ObjectMapper mapper = new ObjectMapper();
        ColorModel color = mapper.readValue(colorJson, ColorModel.class);

        // Kiểm tra dữ liệu hợp lệ
        if (color.getName() == null || color.getName().isEmpty()) {
            return ResponseEntity.badRequest().body("Name is required.");
        }
        

        colorAdminRepository.save(color);
        return ResponseEntity.ok("Color created successfully.");
    } catch (IOException e) {
        logger.error("Error processing request: ", e);
        return ResponseEntity.status(500).body("Error creating color: " + e.getMessage());
    }
}

@PutMapping("/{id}")
public ResponseEntity<String> updateColor(
        @PathVariable("id") int id,
        @RequestPart("color") String colorJson) {
    logger.info("Updating color with ID: {}", id);

    try {
        // Chuyển đổi JSON thành đối tượng UserModel
        ObjectMapper mapper = new ObjectMapper();
        ColorModel color = mapper.readValue(colorJson, ColorModel.class);

        return colorAdminRepository.findById(id)
                .map(existingColor -> {
                    color.setId(id); // Đảm bảo ID được giữ nguyên
                    colorAdminRepository.save(color);
                    return ResponseEntity.ok("Color updated successfully.");
                })
                .orElse(ResponseEntity.notFound().build()); // Trả về 404 nếu không tìm thấy user
    } catch (IOException e) {
        logger.error("Error processing request: ", e);
        return ResponseEntity.status(500).body("Error updating color: " + e.getMessage());
    }
}



    // Xóa người dùng
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteColor(@PathVariable("id") int id) {
        return colorAdminRepository.findById(id)
                .map(color -> {
                    colorAdminRepository.delete(color);
                    return ResponseEntity.ok("Color deleted successfully.");
                })
                .orElse(ResponseEntity.notFound().build()); // Trả về 404 nếu không tìm thấy user
    }

}