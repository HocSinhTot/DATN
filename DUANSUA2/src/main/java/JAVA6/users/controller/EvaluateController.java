package JAVA6.users.controller;

import JAVA6.Model.EvaluateModel;
import JAVA6.Model.ProductDetailsModel;
import JAVA6.Model.UserModel;
import JAVA6.service.EvaluaesService;
import JAVA6.service.ProductDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class EvaluateController {

    @Autowired
    private EvaluaesService evaluaesService;

    @Autowired
    private ProductDetailsService productDetailsService;

    // API: Lấy tất cả đánh giá theo productId
    @GetMapping("/api/evaluations/product/{productId}")
    public ResponseEntity<?> getEvaluationsByProductId(@PathVariable int productId) {
        try {
            // Lấy danh sách đánh giá theo productId
            List<EvaluateModel> evaluations = evaluaesService.getEvaluationsByProductId(productId);

            if (evaluations.isEmpty()) {
                return ResponseEntity.ok("Không có đánh giá nào cho sản phẩm này.");
            }

            // Tạo response chứa thông tin đánh giá và chi tiết sản phẩm
            List<EvaluationResponse> response = evaluations.stream()
                    .map(evaluation -> {
                        UserModel user = evaluation.getUser(); // Lấy thông tin người dùng
                        return new EvaluationResponse(
                                evaluation.getStar(),
                                evaluation.getComment(),
                                evaluation.getImg(), // Hình ảnh trong đánh giá
                                user.getUsername(),
                                user.getImage(), // Hình ảnh của người dùng
                                evaluation.getStatus(), // Truyền status vào constructor
                                evaluation.getOrderDetail().getProduct().getColor().getName(),
                                evaluation.getOrderDetail().getProduct().getProductPrice().getCapacity().getName());
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi khi lấy đánh giá: " + e.getMessage());
        }
    }

    // Lớp dùng để trả dữ liệu
    public static class EvaluationResponse {
        private int star;
        private String comment;
        private String image; // Hình ảnh trong đánh giá
        private String username;
        private String userImage; // Hình ảnh người dùng
        private Boolean status;
        private String color;
        private String capacity;

        public EvaluationResponse(int star, String comment, String image, String username, String userImage,
                Boolean status,
                String color, String capacity) {
            this.star = star;
            this.comment = comment;
            this.image = image;
            this.username = username;
            this.userImage = userImage;
            this.status = status;
            this.color = color;
            this.capacity = capacity;
        }

        // Getters và Setters
        public int getStar() {
            return star;
        }

        public void setStar(int star) {
            this.star = star;
        }

        public String getComment() {
            return comment;
        }

        public void setComment(String comment) {
            this.comment = comment;
        }

        public String getImage() {
            return image;
        }

        public void setImage(String image) {
            this.image = image;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getUserImage() {
            return userImage;
        }

        public void setUserImage(String userImage) {
            this.userImage = userImage;
        }

        public Boolean getStatus() {
            return status; // Getter cho status
        }

        public void setStatus(Boolean status) {
            this.status = status; // Setter cho status
        }

        public String getColor() {
            return color;
        }

        public void setColor(String color) {
            this.color = color;
        }

        public String getCapacity() {
            return capacity;
        }

        public void setCapacity(String capacity) {
            this.capacity = capacity;
        }
    }
}