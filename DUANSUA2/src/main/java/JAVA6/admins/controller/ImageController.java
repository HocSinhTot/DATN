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
import JAVA6.Model.ImageModel;
import JAVA6.Model.ProductModel;
import JAVA6.Model.UserModel;
import JAVA6.repository.BrandRepository;
import JAVA6.repository.ImageRepository;
import JAVA6.repository.CapacityAdminRepository;
import JAVA6.repository.CategoryRepository;
import JAVA6.repository.ColorAdminRepository;
import JAVA6.repository.UsersRepository;
import JAVA6.service.BrandService;
import JAVA6.service.CapacityService;
import JAVA6.service.CategoryService;
import JAVA6.service.ColorService;
// import JAVA6.service.ImagesService;
import JAVA6.service.UserService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/admin/images")
public class ImageController {

    private static final Logger logger = LoggerFactory.getLogger(ImageController.class);

    @Autowired
    private ImageRepository imageRepository ;

    // private  ImagesService imagesService;

    // Lấy danh sách tất cả người dùng
    @GetMapping
    public ResponseEntity<List<ImageModel>> getAllImage() {
        List<ImageModel> image = imageRepository.findAll();
        if (image.isEmpty()) {
            return ResponseEntity.noContent().build(); // Trả về 204 nếu danh sách rỗng
        }
        return ResponseEntity.ok(image); // Trả về danh sách người dùng
    }

    // Lấy thông tin người dùng theo ID
    @GetMapping("/{id}")
    public ResponseEntity<ImageModel> getImageyById(@PathVariable("id") int id) {
        logger.info("Fetching image with ID: {}", id);
        return imageRepository.findById(id)
                .map(image -> {
                    logger.info("Found imgae: {}", image);
                    return ResponseEntity.ok(image);
                })
                .orElse(ResponseEntity.notFound().build()); // Trả về 404 nếu không tìm thấy
    }

    // Thêm người dùng mới hoặc khách hàng
    @PostMapping
    public ResponseEntity<String> createImage(@RequestPart("image") String imageJson,
                                               @RequestParam("product_id") int productId) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            ImageModel image = mapper.readValue(imageJson, ImageModel.class);
            
            // Thiết lập sản phẩm dựa vào productId
            ProductModel product = new ProductModel(); // Tạo mới một đối tượng sản phẩm
            product.setId(productId);
            image.setProduct(product);
    
            // Kiểm tra dữ liệu hợp lệ
            if (image.getUrl() == null || image.getUrl().isEmpty()) {
                return ResponseEntity.badRequest().body("Url is required.");
            }
    
            imageRepository.save(image);
            return ResponseEntity.ok("Image created successfully.");
        } catch (IOException e) {
            logger.error("Error processing request: ", e);
            return ResponseEntity.status(500).body("Error creating image: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateImage(
            @PathVariable("id") int id,
            @RequestPart("image") String imageJson,
            @RequestParam("product_id") int productId) {
        
        logger.info("Updating image with ID: {}", id);
        try {
            ObjectMapper mapper = new ObjectMapper();
            ImageModel image = mapper.readValue(imageJson, ImageModel.class);
            
            // Thiết lập sản phẩm
            ProductModel product = new ProductModel();
            product.setId(productId);
            image.setProduct(product);
            
            return imageRepository.findById(id)
                    .map(existingImage -> {
                        image.setId(id); // Đảm bảo ID được giữ nguyên
                        imageRepository.save(image);
                        return ResponseEntity.ok("Image updated successfully.");
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (IOException e) {
            logger.error("Error processing request: ", e);
            return ResponseEntity.status(500).body("Error updating image: " + e.getMessage());
        }
    }



    // Xóa người dùng
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCImage(@PathVariable("id") int id) {
        return imageRepository.findById(id)
                .map(image -> {
                    imageRepository.delete(image);
                    return ResponseEntity.ok("Image deleted successfully.");
                })
                .orElse(ResponseEntity.notFound().build()); // Trả về 404 nếu không tìm thấy user
    }

}