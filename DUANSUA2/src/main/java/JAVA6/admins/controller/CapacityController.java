package JAVA6.admins.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;

import JAVA6.Model.BrandModel;
import JAVA6.Model.CapacityModel;
import JAVA6.Model.CategoryModel;
import JAVA6.Model.ColorModel;
import JAVA6.Model.ProductModel;
import JAVA6.Model.UserModel;
import JAVA6.repository.BrandRepository;
import JAVA6.repository.CapacityAdminRepository;
import JAVA6.repository.CategoryRepository;
import JAVA6.repository.ColorAdminRepository;
import JAVA6.repository.UsersRepository;
import JAVA6.service.BrandService;
import JAVA6.service.CapacityService;
import JAVA6.service.CategoryService;
import JAVA6.service.ColorService;
import JAVA6.service.UserService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/admin/capacity")
public class CapacityController {

    private static final Logger logger = LoggerFactory.getLogger(CapacityController.class);

    @Autowired
    private CapacityAdminRepository capacityAdminRepository;

    @Autowired
    private CapacityService capacityService;

    // Lấy danh sách tất cả người dùng
    @GetMapping
    public ResponseEntity<List<CapacityModel>> getAllCapacity() {
        List<CapacityModel> capacity = capacityAdminRepository.findAll();
        if (capacity.isEmpty()) {
            return ResponseEntity.noContent().build(); // Trả về 204 nếu danh sách rỗng
        }
        return ResponseEntity.ok(capacity); // Trả về danh sách người dùng
    }

    // Lấy thông tin người dùng theo ID
    @GetMapping("/{id}")
    public ResponseEntity<CapacityModel> getCapacityById(@PathVariable("id") int id) {
        logger.info("Fetching color with ID: {}", id);
        return capacityAdminRepository.findById(id)
                .map(capacity -> {
                    logger.info("Found capacity: {}", capacity);
                    return ResponseEntity.ok(capacity);
                })
                .orElse(ResponseEntity.notFound().build()); // Trả về 404 nếu không tìm thấy
    }

    // Thêm người dùng mới hoặc khách hàng
@PostMapping
public ResponseEntity<String> createCapacity(
        @RequestPart("capacity") String capacityJson) {
    try {
        ObjectMapper mapper = new ObjectMapper();
        CapacityModel capacity = mapper.readValue(capacityJson, CapacityModel.class);

        // Kiểm tra dữ liệu hợp lệ
        if (capacity.getName() == null || capacity.getName().isEmpty()) {
            return ResponseEntity.badRequest().body("Name is required.");
        }
        

        capacityAdminRepository.save(capacity);
        return ResponseEntity.ok("Capacity created successfully.");
    } catch (IOException e) {
        logger.error("Error processing request: ", e);
        return ResponseEntity.status(500).body("Error creating color: " + e.getMessage());
    }
}

@PutMapping("/{id}")
public ResponseEntity<String> updateCapacity(
        @PathVariable("id") int id,
        @RequestPart("capacity") String capacityJson) {
    logger.info("Updating capacity with ID: {}", id);

    try {
        // Chuyển đổi JSON thành đối tượng UserModel
        ObjectMapper mapper = new ObjectMapper();
        CapacityModel capacity = mapper.readValue(capacityJson, CapacityModel.class);

        return capacityAdminRepository.findById(id)
                .map(existingCapacity -> {
                    capacity.setId(id); // Đảm bảo ID được giữ nguyên
                    capacityAdminRepository.save(capacity);
                    return ResponseEntity.ok("Capacity updated successfully.");
                })
                .orElse(ResponseEntity.notFound().build()); // Trả về 404 nếu không tìm thấy user
    } catch (IOException e) {
        logger.error("Error processing request: ", e);
        return ResponseEntity.status(500).body("Error updating color: " + e.getMessage());
    }
}



    // Xóa người dùng
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCapacity(@PathVariable("id") int id) {
        return capacityAdminRepository.findById(id)
                .map(capacity -> {
                    capacityAdminRepository.delete(capacity);
                    return ResponseEntity.ok("Capacity deleted successfully.");
                })
                .orElse(ResponseEntity.notFound().build()); // Trả về 404 nếu không tìm thấy user
    }

}