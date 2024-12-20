package JAVA6.admins.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import JAVA6.Model.ProductsPriceModel;
import JAVA6.repository.ProductsPriceRepository;
import JAVA6.service.ProductsPriceService;
import jakarta.persistence.EntityNotFoundException;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/products-price")
public class ProductsPriceController {

    @Autowired
    private ProductsPriceService productsPriceService;

    @Autowired
    private ProductsPriceRepository productsPriceRepository;

    @GetMapping
    public ResponseEntity<List<ProductsPriceModel>> getAllProductsPrices() {
        try {
            return ResponseEntity.ok(productsPriceService.getAllProductsPrices());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
public ResponseEntity<ProductsPriceModel> createProductsPrice(@RequestBody ProductsPriceModel productsPrice) {
    if (productsPrice.getPrice() == null) {
        System.out.println("Price is null!"); // Log lỗi
        return ResponseEntity.badRequest().build();
    }
    try {
        ProductsPriceModel createdProductPrice = productsPriceService.createProductsPrice(productsPrice);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProductPrice);
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
}

    @PutMapping("/{productId}/{capacityId}")
    public ResponseEntity<ProductsPriceModel> updateProductsPrice(@PathVariable Integer productId,
                                                                  @PathVariable Integer capacityId,
                                                                  @RequestBody ProductsPriceModel productsPrice) {
        try {
            return ResponseEntity.ok(productsPriceService.updateProductsPrice(productId, capacityId, productsPrice));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{productId}/{capacityId}")
    public ResponseEntity<Void> deleteProductsPrice(@PathVariable Integer productId, 
                                                    @PathVariable Integer capacityId) {
        try {
            Optional<ProductsPriceModel> productPriceOptional = productsPriceRepository.findByProductIdAndCapacityId(productId, capacityId);
            if (productPriceOptional.isPresent()) {
                System.out.println("Xóa sản phẩm với ID " + productId + " và Capacity ID " + capacityId); // Logging
                productsPriceRepository.delete(productPriceOptional.get());
                return ResponseEntity.noContent().build();  // Trả về 204 No Content khi xóa thành công
            } else {
                System.out.println("Không tìm thấy sản phẩm với ID " + productId + " và Capacity ID " + capacityId); // Logging
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();  // Trả về 404 nếu không tìm thấy sản phẩm
            }
        } catch (Exception e) {
            e.printStackTrace();  // In lỗi ra console để xem chi tiết
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();  // Trả về 500 nếu có lỗi trong server
        }
    }
    
}

   



