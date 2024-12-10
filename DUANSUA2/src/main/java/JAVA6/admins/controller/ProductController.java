package JAVA6.admins.controller;

import JAVA6.Model.ProductModel;
import JAVA6.Model.UserModel;
import JAVA6.repository.ProductRepository;
import JAVA6.service.BrandService;
import JAVA6.service.CategoryService;
import JAVA6.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/admin/products")
public class ProductController {
    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private BrandService brandService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductService productService;

    // Hiển thị danh sách sản phẩm
    @GetMapping
    public ResponseEntity<?> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductModel> productPage = productRepository.findAll(pageable);

        if (productPage.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(Map.of(
                "content", productPage.getContent(),
                "totalPages", productPage.getTotalPages(),
                "totalElements", productPage.getTotalElements()));
    }

    // Lấy thông tin sản phẩm theo ID
    @GetMapping("/{id}")
    public ResponseEntity<ProductModel> getProductById(@PathVariable("id") int id) {
        logger.info("Fetching user with ID: {}", id);
        return productRepository.findById(id)
                .map(product -> {
                    logger.info("Found product: {}", product);
                    return ResponseEntity.ok(product);
                })
                .orElse(ResponseEntity.notFound().build()); // Trả về 404 nếu không tìm thấy
    }

    // Hiển thị form thêm sản phẩm
    @GetMapping("/products/add")
    public String showCreateProductForm(Model model) {
        model.addAttribute("categories", categoryService.getAllCate());
        model.addAttribute("brands", brandService.getAllBrands());
        model.addAttribute("product", new ProductModel()); // Thêm đối tượng
        return "admin/addProduct"; // Tên view của form thêm sản phẩm
    }

    @PostMapping
    public ResponseEntity<String> createProduct(
            @RequestPart("product") String productJson) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            ProductModel product = mapper.readValue(productJson, ProductModel.class);

            // Kiểm tra dữ liệu hợp lệ
            if (product.getName() == null || product.getName().isEmpty()) {
                return ResponseEntity.badRequest().body("Name is required.");
            }
            if (product.getDescription() == null || product.getDescription().isEmpty()) {
                return ResponseEntity.badRequest().body("Description is required.");
            }
            if (product.getPrice() == null) {
                return ResponseEntity.badRequest().body("Price is required.");
            }
            if (product.getQuantity() <= 0) {
                return ResponseEntity.badRequest().body("Quantity is required.");
            }
            if (product.getBrand() == null) {
                return ResponseEntity.badRequest().body("Brand is required.");
            }
            if (product.getCategory() == null) {
                return ResponseEntity.badRequest().body("Category is required.");
            }
            productRepository.save(product);
            return ResponseEntity.ok("Products (or customer) created successfully.");
        } catch (IOException e) {
            logger.error("Error processing request: ", e);
            return ResponseEntity.status(500).body("Error creating product: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateProduct(
            @PathVariable("id") int id,
            @RequestBody ProductModel product) {
        logger.info("Updating product with ID: {}", id);

        return productRepository.findById(id)
                .map(existingProduct -> {
                    product.setId(id); // Đảm bảo giữ nguyên ID
                    productRepository.save(product);
                    return ResponseEntity.ok("Product updated successfully.");
                })
                .orElse(ResponseEntity.notFound().build()); // Trả về 404 nếu không tìm thấy sản phẩm
    }

    // Xóa người dùng
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable("id") int id) {
        return productRepository.findById(id)
                .map(product -> {
                    productRepository.delete(product);
                    return ResponseEntity.ok("Product deleted successfully.");
                })
                .orElse(ResponseEntity.notFound().build()); // Trả về 404 nếu không tìm thấy user
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductModel>> searchProductsByName(@RequestParam("name") String name) {
        List<ProductModel> products = productRepository.findByNameContainingIgnoreCase(name);
        if (products.isEmpty()) {
            return ResponseEntity.noContent().build(); // Trả về 204 nếu không tìm thấy sản phẩm
        }
        return ResponseEntity.ok(products); // Trả về danh sách sản phẩm
    }

}
