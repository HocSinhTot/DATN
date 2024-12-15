package JAVA6.users.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import JAVA6.Model.ProductModel;
import JAVA6.Model.CapacityModel;
import JAVA6.Model.ColorModel;
import JAVA6.Model.ImageModel;

import JAVA6.repository.ProductdetailsRepository;
import JAVA6.service.ProductDetailsService;


@RestController
@RequestMapping("/api/product")
public class ProductdetailsController {

    @Autowired
    private ProductDetailsService productDetailsService;



    @Autowired
    private ProductdetailsRepository productdetailsRepository;

    @GetMapping("/{id}/capacities")
    public ResponseEntity<List<Map<String, Object>>> getProductCapacities(@PathVariable("id") int productId) {
        List<Map<String, Object>> capacities = productDetailsService.getProductCapacitiesAndPrices(productId);
        return ResponseEntity.ok(capacities);
    }
    @GetMapping("/{id}/colors")
    public ResponseEntity<List<Map<String, Object>>> getProductColors(@PathVariable("id") int productId) {
        List<Map<String, Object>> colors = productDetailsService.getProductColor(productId);
        return ResponseEntity.ok(colors);
    }
    @GetMapping("/checkStock/{id}")
    public ResponseEntity<Map<String, Object>> checkStock(@PathVariable("id") int productId) {
        // Tìm sản phẩm theo productId
        ProductModel product = productdetailsRepository.findById(productId).orElse(null);

        if (product != null) {
            // Trả về số lượng tồn kho từ thuộc tính quantity trong bảng Product
            return ResponseEntity.ok(Map.of("stockQuantity", product.getQuantity()));
        } else {
            return ResponseEntity.notFound().build(); // Nếu không tìm thấy sản phẩm, trả về 404
        }
    }
    @GetMapping("/{id}")
        public ResponseEntity<ProductModel> getProductById(@PathVariable("id") int id) {
            ProductModel product = productdetailsRepository.findById(id).orElse(null);
            if (product != null) {
                return ResponseEntity.ok(product);
            } else {
                return ResponseEntity.notFound().build(); // Trả về 404 nếu không tìm thấy sản phẩm
            }
        }
        @GetMapping("/{id}/similar")
        public ResponseEntity<List<ProductModel>> getSimilarProducts(@PathVariable("id") int productId) {
            List<ProductModel> similarProducts = productDetailsService.getSimilarProducts(productId);
            if (!similarProducts.isEmpty()) {
                return ResponseEntity.ok(similarProducts);
            } else {
                return ResponseEntity.noContent().build(); // Trả về 204 nếu không có sản phẩm tương tự
            }
        }
        
    // Response DTO để gói dữ liệu trả về API
    public static class ProductDetailResponse {
        private ProductModel product;
        private List<ImageModel> images;
       
        public ProductDetailResponse(ProductModel product, List<ImageModel> images) {
            this.product = product;
            this.images = images;
          
        }

        // Getter and Setter
        public ProductModel getProduct() {
            return product;
        }

        public void setProduct(ProductModel product) {
            this.product = product;
        }

        public List<ImageModel> getImages() {
            return images;
        }

        public void setImages(List<ImageModel> images) {
            this.images = images;
        }

      
       
    }
}
