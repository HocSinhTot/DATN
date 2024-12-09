package JAVA6.admins.controller;

import JAVA6.Model.ProductModel;
import JAVA6.repository.ProductRepository;
import JAVA6.service.BrandService;
import JAVA6.service.CategoryService;
import JAVA6.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Map;

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

    // Display product list with pagination
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

    // Search products by name
    @GetMapping("/search")
    public ResponseEntity<List<ProductModel>> searchProductsByName(@RequestParam("name") String name) {
        List<ProductModel> products = productRepository.findByNameContainingIgnoreCase(name);
        if (products.isEmpty()) {
            return ResponseEntity.noContent().build(); // Return 204 if no products found
        }
        return ResponseEntity.ok(products); // Return the list of products
    }

    // Delete product by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable("id") int id) {
        return productRepository.findById(id)
                .map(product -> {
                    productRepository.delete(product);
                    return ResponseEntity.ok("Product deleted successfully.");
                })
                .orElse(ResponseEntity.notFound().build()); // Return 404 if product not found
    }
}
