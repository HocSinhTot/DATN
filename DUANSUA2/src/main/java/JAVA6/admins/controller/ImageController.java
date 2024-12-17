package JAVA6.admins.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import JAVA6.Model.ImageModel;
import JAVA6.Model.ProductModel;
import JAVA6.repository.ImageRepository;
import JAVA6.repository.ProductRepository;

import java.io.IOException;
import java.util.List;


@RestController
@RequestMapping("/api/admin/images")
public class ImageController {

    private static final Logger logger = LoggerFactory.getLogger(ImageController.class);

    @Autowired
    private ImageRepository imageRepository ;

    @Autowired
    private ProductRepository productRepository ;

    // private  ImagesService imagesService;

    // Lấy danh sách tất cả người dùng
    @GetMapping
public ResponseEntity<List<ImageModel>> getAllImage() {
    List<ImageModel> images = imageRepository.findAllWithProducts(); 
    if (images.isEmpty()) {
        return ResponseEntity.noContent().build(); 
    }
    logger.info("Found images: {}", images);  // Log dữ liệu để debug
    return ResponseEntity.ok(images); 
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

    @PostMapping
    public ResponseEntity<String> createImage(@RequestBody ImageModel image) {
        try {
            // Kiểm tra dữ liệu hợp lệ
            if (image.getUrl() == null || image.getUrl().isEmpty()) {
                return ResponseEntity.badRequest().body("Url is required.");
            }
            if (image.getProduct() == null ) {
                return ResponseEntity.badRequest().body("Product is required.");
            }
            // Lưu sản phẩm vào cơ sở dữ liệu
            imageRepository.save(image);
            return ResponseEntity.ok("Image created successfully.");
        } catch (Exception e) {
            logger.error("Error processing request: ", e);
            return ResponseEntity.status(500).body("Error creating image: " + e.getMessage());
        }
    }
    
    
        @PutMapping("/{id}")
        public ResponseEntity<String> updateImage(
                @PathVariable("id") int id,
                @RequestBody ImageModel image) {
            logger.info("Updating product with ID: {}", id);
    
            return imageRepository.findById(id)
                    .map(existingImage -> {
                        image.setId(id); // Đảm bảo giữ nguyên ID
                        imageRepository.save(image);
                        return ResponseEntity.ok("Image updated successfully.");
                    })
                    .orElse(ResponseEntity.notFound().build()); // Trả về 404 nếu không tìm thấy sản phẩm
        }
    
        // // Xóa người dùng
        // @DeleteMapping("/{id}")
        // public ResponseEntity<String> deleteImage(@PathVariable("id") int id) {
        //     return productRepository.findById(id)
        //             .map(image -> {
        //                 imageRepository.delete(image);
        //                 return ResponseEntity.ok("Image deleted successfully.");
        //             })
        //             .orElse(ResponseEntity.notFound().build()); // Trả về 404 nếu không tìm thấy user
        // }
}