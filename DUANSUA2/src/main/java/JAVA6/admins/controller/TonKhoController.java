package JAVA6.admins.controller;

import JAVA6.Model.ProductModel;
import JAVA6.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
public class TonKhoController {

    @Autowired
    private ProductRepository productRepository;

    // Lấy danh sách sản phẩm tồn kho (số lượng > 0), hỗ trợ tìm kiếm và phân trang
    @GetMapping("/stock")
    public ResponseEntity<Page<ProductModel>> getProductsInStock(
            @RequestParam(value = "searchTerm", required = false, defaultValue = "") String searchTerm,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sortOrder", defaultValue = "asc") String sortOrder) {

        // Đảm bảo rằng sắp xếp theo giá (price) đang hoạt động
        Pageable pageable;
        if (sortOrder.equalsIgnoreCase("desc")) {
            pageable = PageRequest.of(page, size, Sort.by(Sort.Order.desc("price"))); // Sắp xếp giảm dần theo giá
        } else {
            pageable = PageRequest.of(page, size, Sort.by(Sort.Order.asc("price"))); // Sắp xếp tăng dần theo giá
        }

        // Lấy danh sách sản phẩm trong kho
        Page<ProductModel> productsInStock;
        if (searchTerm.isEmpty()) {
            productsInStock = productRepository.findByQuantityGreaterThan(0, pageable); // Lọc theo số lượng lớn hơn 0
        } else {
            productsInStock = productRepository.findByNameContainingAndQuantityGreaterThan(searchTerm, 0, pageable); // Lọc
                                                                                                                     // theo
                                                                                                                     // tên
                                                                                                                     // sản
                                                                                                                     // phẩm
        }

        // Kiểm tra nếu không có sản phẩm
        if (productsInStock.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        // Trả về danh sách sản phẩm sau khi sắp xếp
        return ResponseEntity.ok(productsInStock);
    }

    // Cập nhật sản phẩm
    @PutMapping("/{id}")
    public ResponseEntity<ProductModel> updateProduct(@PathVariable int id, @RequestBody ProductModel productDetails) {
        return productRepository.findById(id).map(product -> {
            product.setName(productDetails.getName());
            product.setQuantity(productDetails.getQuantity());
            final ProductModel updatedProduct = productRepository.save(product);
            return ResponseEntity.ok(updatedProduct);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Xóa sản phẩm
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable int id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
