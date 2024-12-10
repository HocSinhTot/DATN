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
import JAVA6.Model.UserModel;
import JAVA6.repository.BrandRepository;
import JAVA6.repository.CategoryRepository;
import JAVA6.repository.UsersRepository;
import JAVA6.service.BrandService;
import JAVA6.service.CategoryService;
import JAVA6.service.UserService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/admin/brands")
public class BrandController {

    private static final Logger logger = LoggerFactory.getLogger(BrandController.class);

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private BrandService brandService;

    // Lấy danh sách tất cả người dùng
    @GetMapping
    public ResponseEntity<List<BrandModel>> getAllBrand() {
        List<BrandModel> brand = brandRepository.findAll();
        if (brand.isEmpty()) {
            return ResponseEntity.noContent().build(); // Trả về 204 nếu danh sách rỗng
        }
        return ResponseEntity.ok(brand); // Trả về danh sách người dùng
    }

    // Lấy thông tin người dùng theo ID
    @GetMapping("/{id}")
    public ResponseEntity<BrandModel> getBrandById(@PathVariable("id") int id) {
        logger.info("Fetching brnad with ID: {}", id);
        return brandRepository.findById(id)
                .map(brand -> {
                    logger.info("Found brand: {}", brand);
                    return ResponseEntity.ok(brand);
                })
                .orElse(ResponseEntity.notFound().build()); // Trả về 404 nếu không tìm thấy
    }

    // Thêm người dùng mới hoặc khách hàng
@PostMapping
public ResponseEntity<String> createBrand(
        @RequestPart("brand") String brandJson) {
    try {
        ObjectMapper mapper = new ObjectMapper();
        BrandModel brand = mapper.readValue(brandJson, BrandModel.class);

        // Kiểm tra dữ liệu hợp lệ
        if (brand.getName() == null || brand.getName().isEmpty()) {
            return ResponseEntity.badRequest().body("Name is required.");
        }
        

        brandRepository.save(brand);
        return ResponseEntity.ok("Brand created successfully.");
    } catch (IOException e) {
        logger.error("Error processing request: ", e);
        return ResponseEntity.status(500).body("Error creating category: " + e.getMessage());
    }
}

@PutMapping("/{id}")
public ResponseEntity<String> updateBrand(
        @PathVariable("id") int id,
        @RequestPart("brand") String brandJson) {
    logger.info("Updating brand with ID: {}", id);

    try {
        // Chuyển đổi JSON thành đối tượng UserModel
        ObjectMapper mapper = new ObjectMapper();
        BrandModel brand = mapper.readValue(brandJson, BrandModel.class);

        return brandRepository.findById(id)
                .map(existingBrand -> {
                    brand.setId(id); // Đảm bảo ID được giữ nguyên
                    brandRepository.save(brand);
                    return ResponseEntity.ok("Brand updated successfully.");
                })
                .orElse(ResponseEntity.notFound().build()); // Trả về 404 nếu không tìm thấy user
    } catch (IOException e) {
        logger.error("Error processing request: ", e);
        return ResponseEntity.status(500).body("Error updating category: " + e.getMessage());
    }
}



    // Xóa người dùng
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBrand(@PathVariable("id") int id) {
        return brandRepository.findById(id)
                .map(brand -> {
                    brandRepository.delete(brand);
                    return ResponseEntity.ok("Brand deleted successfully.");
                })
                .orElse(ResponseEntity.notFound().build()); // Trả về 404 nếu không tìm thấy user
    }

}