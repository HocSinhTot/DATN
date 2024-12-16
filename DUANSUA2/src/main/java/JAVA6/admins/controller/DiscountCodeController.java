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
import JAVA6.Model.DiscountCodeModel;
import JAVA6.Model.UserModel;
import JAVA6.repository.BrandRepository;
import JAVA6.repository.CategoryRepository;
import JAVA6.repository.DiscountCodeRepository;
import JAVA6.repository.UsersRepository;
import JAVA6.service.BrandService;
import JAVA6.service.CategoryService;
import JAVA6.service.DiscountCodeService;
import JAVA6.service.UserService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/admin/discounts")
public class DiscountCodeController {

    private static final Logger logger = LoggerFactory.getLogger(DiscountCodeController.class);

    @Autowired
    private DiscountCodeRepository discountCodeRepository;

    @Autowired
    private DiscountCodeService discountCodeService;

    // Lấy danh sách tất cả người dùng
    @GetMapping
    public ResponseEntity<List<DiscountCodeModel>> getAllDiscountCode() {
        List<DiscountCodeModel> discount = discountCodeRepository.findAll();
        if (discount.isEmpty()) {
            return ResponseEntity.noContent().build(); // Trả về 204 nếu danh sách rỗng
        }
        return ResponseEntity.ok(discount); // Trả về danh sách người dùng
    }

    // Lấy thông tin người dùng theo ID
    @GetMapping("/{id}")
    public ResponseEntity<DiscountCodeModel> getDiscountCodeById(@PathVariable("id") int id) {
        logger.info("Fetching brnad with ID: {}", id);
        return discountCodeRepository.findById(id)
                .map(discount -> {
                    logger.info("Found discount: {}", discount);
                    return ResponseEntity.ok(discount);
                })
                .orElse(ResponseEntity.notFound().build()); // Trả về 404 nếu không tìm thấy
    }

    // Thêm người dùng mới hoặc khách hàng
@PostMapping
public ResponseEntity<String> createDiscountCode(
        @RequestPart("discount") String discountJson) {
    try {
        ObjectMapper mapper = new ObjectMapper();
        DiscountCodeModel discount= mapper.readValue(discountJson, DiscountCodeModel.class);

        // Kiểm tra dữ liệu hợp lệ
        if (discount.getCode() == null || discount.getCode().isEmpty()) {
            return ResponseEntity.badRequest().body("Code is required.");
        }
        if (discount.getValue() == null ) {
            return ResponseEntity.badRequest().body("Value is required.");
        }
        if (discount.getStartDate() == null ) {
            return ResponseEntity.badRequest().body("StartDate is required.");
        }
        if (discount.getEndDate() == null ) {
            return ResponseEntity.badRequest().body("EndDate is required.");
        }
        discountCodeRepository.save(discount);
        return ResponseEntity.ok("Discount created successfully.");
    } catch (IOException e) {
        logger.error("Error processing request: ", e);
        return ResponseEntity.status(500).body("Error creating category: " + e.getMessage());
    }
}

@PutMapping("/{id}")
public ResponseEntity<String> updateDiscountCode(
        @PathVariable("id") int id,
        @RequestPart("discount") String discountJson) {
    logger.info("Updating discount with ID: {}", id);

    try {
        // Chuyển đổi JSON thành đối tượng UserModel
        ObjectMapper mapper = new ObjectMapper();
        DiscountCodeModel discount = mapper.readValue(discountJson, DiscountCodeModel.class);

        return discountCodeRepository.findById(id)
                .map(existingDiscount -> {
                    discount.setId(id); // Đảm bảo ID được giữ nguyên
                    discountCodeRepository.save(discount);
                    return ResponseEntity.ok("Discount updated successfully.");
                })
                .orElse(ResponseEntity.notFound().build()); // Trả về 404 nếu không tìm thấy user
    } catch (IOException e) {
        logger.error("Error processing request: ", e);
        return ResponseEntity.status(500).body("Error updating category: " + e.getMessage());
    }
}



    // Xóa người dùng
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDiscount(@PathVariable("id") int id) {
        return discountCodeRepository.findById(id)
                .map(discount -> {
                    discountCodeRepository.delete(discount);
                    return ResponseEntity.ok("Discount deleted successfully.");
                })
                .orElse(ResponseEntity.notFound().build()); // Trả về 404 nếu không tìm thấy user
    }

}