package JAVA6.admins.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;

import JAVA6.Model.CategoryModel;
import JAVA6.Model.UserModel;
import JAVA6.repository.CategoryRepository;
import JAVA6.repository.UsersRepository;
import JAVA6.service.CategoryService;
import JAVA6.service.UserService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/admin/category")
public class Category2Controller {

    private static final Logger logger = LoggerFactory.getLogger(Category2Controller.class);

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CategoryService categoryService;

    // Lấy danh sách tất cả người dùng
    @GetMapping
    public ResponseEntity<List<CategoryModel>> getAllCategory() {
        List<CategoryModel> category = categoryRepository.findAll();
        if (category.isEmpty()) {
            return ResponseEntity.noContent().build(); // Trả về 204 nếu danh sách rỗng
        }
        return ResponseEntity.ok(category); // Trả về danh sách người dùng
    }

    // Lấy thông tin người dùng theo ID
    @GetMapping("/{id}")
    public ResponseEntity<CategoryModel> getCategoryById(@PathVariable("id") int id) {
        logger.info("Fetching category with ID: {}", id);
        return categoryRepository.findById(id)
                .map(category -> {
                    logger.info("Found category: {}", category);
                    return ResponseEntity.ok(category);
                })
                .orElse(ResponseEntity.notFound().build()); // Trả về 404 nếu không tìm thấy
    }

    // Thêm người dùng mới hoặc khách hàng
    @PostMapping
    public ResponseEntity<String> createCategory(
            @RequestPart("category") String categoryJson) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            CategoryModel category = mapper.readValue(categoryJson, CategoryModel.class);

            // Kiểm tra dữ liệu hợp lệ
            if (category.getName() == null || category.getName().isEmpty()) {
                return ResponseEntity.badRequest().body("Name is required.");
            }

            categoryRepository.save(category);
            return ResponseEntity.ok("Category created successfully.");
        } catch (IOException e) {
            logger.error("Error processing request: ", e);
            return ResponseEntity.status(500).body("Error creating category: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateCategory(
            @PathVariable("id") int id,
            @RequestPart("category") String categoryJson) {
        logger.info("Updating category with ID: {}", id);

        try {
            // Chuyển đổi JSON thành đối tượng UserModel
            ObjectMapper mapper = new ObjectMapper();
            CategoryModel category = mapper.readValue(categoryJson, CategoryModel.class);

            return categoryRepository.findById(id)
                    .map(existingCategory -> {
                        category.setId(id); // Đảm bảo ID được giữ nguyên
                        categoryRepository.save(category);
                        return ResponseEntity.ok("Category updated successfully.");
                    })
                    .orElse(ResponseEntity.notFound().build()); // Trả về 404 nếu không tìm thấy user
        } catch (IOException e) {
            logger.error("Error processing request: ", e);
            return ResponseEntity.status(500).body("Error updating category: " + e.getMessage());
        }
    }

    // Xóa người dùng
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable("id") int id) {
        return categoryRepository.findById(id)
                .map(category -> {
                    categoryRepository.delete(category);
                    return ResponseEntity.ok("Category deleted successfully.");
                })
                .orElse(ResponseEntity.notFound().build()); // Trả về 404 nếu không tìm thấy user
    }

}