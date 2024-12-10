package JAVA6.users.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import JAVA6.Model.CategoryModel;
import JAVA6.Model.ImageModel;
import JAVA6.Model.BrandModel;
import JAVA6.Model.ProductModel;
import JAVA6.service.ImagesService;
import JAVA6.service.ProductService;
import JAVA6.service.BrandService;
import JAVA6.service.CategoryService;
import JAVA6.repository.ProductdetailsRepository;

import java.util.List;
@RestController
public class IndexController {

    private static final Logger logger = LoggerFactory.getLogger(IndexController.class);

    @Autowired
    private ProductService productService;
    @Autowired
    private BrandService brandsService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private ImagesService imagesService;

    @Autowired
    private ProductdetailsRepository productdetailsRepository;

    // API Endpoint để lấy sản phẩm theo các tiêu chí lọc
    @GetMapping("/api/products")
    public ResponseEntity<List<ProductModel>> listSanPham(
            @RequestParam(value = "sort", required = false) String sort,
            @RequestParam(value = "categoryId", required = false) Integer categoryId,
            @RequestParam(value = "brandId", required = false) Integer brandId,
            @RequestParam(value = "minPrice", required = false) Integer minPrice,
            @RequestParam(value = "maxPrice", required = false) Integer maxPrice,
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "page", defaultValue = "0") int page, // Thêm tham số page
            @RequestParam(value = "size", defaultValue = "20") int size) { // Thêm tham số size
    
        // Lọc sản phẩm theo các tiêu chí và trả về danh sách sản phẩm
        Page<ProductModel> pageProducts = productService.getProductsByFilters(
                categoryId, 
                brandId,
                sort != null && sort.equalsIgnoreCase("asc"), 
                minPrice, 
                maxPrice, 
                keyword, 
                page, 
                size);
    
        return ResponseEntity.ok(pageProducts.getContent()); // Trả về danh sách sản phẩm
    }
    
    // API Endpoint để lấy sản phẩm theo ID
 

    // API Endpoint để lấy ảnh của sản phẩm theo productId
    @GetMapping("/api/product/{id}/images")
    public ResponseEntity<List<ImageModel>> getProductImages(@PathVariable("id") int productId) {
        ProductModel product = productdetailsRepository.findById(productId).orElse(null);
        if (product != null) {
            return ResponseEntity.ok(product.getImages()); // Trả về danh sách ảnh của sản phẩm
        } else {
            return ResponseEntity.notFound().build(); // Trả về 404 nếu không tìm thấy sản phẩm
        }
    }

    // API Endpoint để lấy tất cả các danh mục sản phẩm
    @GetMapping("/api/categories")
    public ResponseEntity<List<CategoryModel>> getAllCategories() {
        List<CategoryModel> categories = categoryService.getAllCate();
        if (categories.isEmpty()) {
            return ResponseEntity.noContent().build(); // Trả về 204 nếu không có danh mục
        }
        return ResponseEntity.ok(categories); // Trả về 200 OK nếu có danh mục
    }
    @GetMapping("/api/brands")
    public ResponseEntity<List<BrandModel>> getAllBrands() {
        List<BrandModel> brands = brandsService.getAllBrands();
        if (brands.isEmpty()) {
            return ResponseEntity.noContent().build(); // Trả về 204 nếu không có danh mục
        }
        return ResponseEntity.ok(brands); // Trả về 200 OK nếu có danh mục
    }
}
