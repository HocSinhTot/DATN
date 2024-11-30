package JAVA6.admins.controller;

import JAVA6.Model.ImageModel;
import JAVA6.service.ImagesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/images")
public class ImageController {

    @Autowired
    private ImagesService imageService;

    // Hiển thị danh sách hình ảnh
    @GetMapping
    public List<ImageModel> getAllImages() {
        return imageService.getAllImages(); // Trả về danh sách hình ảnh dưới dạng JSON
    }

    // // Thêm hình ảnh mới
    // @PostMapping("/add")
    // public ResponseEntity<ImageModel> addImage(@RequestBody ImageModel image) {
    // ImageModel savedImage = imageService.saveImage(image);
    // return ResponseEntity.ok(savedImage); // Trả về hình ảnh vừa thêm dưới dạng
    // JSON
    // }

    // // Xóa hình ảnh theo ID
    // @DeleteMapping("/delete/{id}")
    // public ResponseEntity<Void> deleteImage(@PathVariable int id) {
    // imageService.deleteImage(id);
    // return ResponseEntity.noContent().build(); // Trả về trạng thái 204 (No
    // Content) khi xóa thành công
    // }
}
