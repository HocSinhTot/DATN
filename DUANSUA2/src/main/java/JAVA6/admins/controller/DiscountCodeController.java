package JAVA6.admins.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.databind.ObjectMapper;

import JAVA6.Model.DiscountCodeModel;
import JAVA6.repository.DiscountCodeRepository;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/admin/discounts")
public class DiscountCodeController {

    private static final Logger logger = LoggerFactory.getLogger(DiscountCodeController.class);

    @Autowired
    private DiscountCodeRepository discountCodeRepository;

    // Lấy danh sách tất cả các mã giảm giá
    @GetMapping
    public ResponseEntity<List<DiscountCodeModel>> getAllDiscountCode() {
        List<DiscountCodeModel> discount = discountCodeRepository.findAll();
        if (discount.isEmpty()) {
            return ResponseEntity.noContent().build(); // Trả về 204 nếu danh sách rỗng
        }
        return ResponseEntity.ok(discount); // Trả về danh sách mã giảm giá
    }

    // Lấy thông tin mã giảm giá theo ID
    @GetMapping("/{id}")
    public ResponseEntity<DiscountCodeModel> getDiscountCodeById(@PathVariable("id") int id) {
        logger.info("Fetching discount with ID: {}", id);
        return discountCodeRepository.findById(id)
                .map(discount -> {
                    logger.info("Found discount: {}", discount);
                    return ResponseEntity.ok(discount);
                })
                .orElse(ResponseEntity.notFound().build()); // Trả về 404 nếu không tìm thấy mã giảm giá
    }

    // Thêm mã giảm giá mới
    @PostMapping
    public ResponseEntity<String> createDiscountCode(@RequestBody DiscountCodeModel discount) {
        try {
            // Kiểm tra dữ liệu hợp lệ
            if (discount.getCode() == null || discount.getCode().isEmpty()) {
                return ResponseEntity.badRequest().body("Code is required.");
            }
            if (discount.getValue() == null) {
                return ResponseEntity.badRequest().body("Value is required.");
            }
            if (discount.getStartDate() == null) {
                return ResponseEntity.badRequest().body("StartDate is required.");
            }
            if (discount.getEndDate() == null) {
                return ResponseEntity.badRequest().body("EndDate is required.");
            }
            
            discountCodeRepository.save(discount);  // Lưu mã giảm giá vào cơ sở dữ liệu
            return ResponseEntity.ok("Discount created successfully.");
        } catch (Exception e) {
            logger.error("Error processing request: ", e);
            return ResponseEntity.status(500).body("Error creating discount: " + e.getMessage());
        }
    }

    // Cập nhật mã giảm giá
    @PutMapping("/{id}")
    public ResponseEntity<String> updateDiscountCode(@PathVariable("id") int id, @RequestBody DiscountCodeModel discount) {
        logger.info("Updating discount with ID: {}", id);

        try {
            return discountCodeRepository.findById(id)
                    .map(existingDiscount -> {
                        discount.setId(id); // Giữ nguyên ID khi cập nhật
                        discountCodeRepository.save(discount); // Cập nhật mã giảm giá
                        return ResponseEntity.ok("Discount updated successfully.");
                    })
                    .orElse(ResponseEntity.notFound().build()); // Trả về 404 nếu không tìm thấy mã giảm giá
        } catch (Exception e) {
            logger.error("Error processing request: ", e);
            return ResponseEntity.status(500).body("Error updating discount: " + e.getMessage());
        }
    }

    // Xóa mã giảm giá
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDiscount(@PathVariable("id") int id) {
        return discountCodeRepository.findById(id)
                .map(discount -> {
                    discountCodeRepository.delete(discount);  // Xóa mã giảm giá khỏi cơ sở dữ liệu
                    return ResponseEntity.ok("Discount deleted successfully.");
                })
                .orElse(ResponseEntity.notFound().build());  // Trả về 404 nếu không tìm thấy mã giảm giá
    }
}
