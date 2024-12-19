package JAVA6.users.controller;

import JAVA6.service.EvaluaesService;
import JAVA6.service.HistoryService;
import JAVA6.service.OrderDetailService;
import JAVA6.service.OrderService; // Đảm bảo import service OrderService
import JAVA6.service.ProductService;
import JAVA6.service.UserService;
import JAVA6.service.UsersService;
import JAVA6.Model.EvaluateModel;
import JAVA6.Model.OrderDetailModel;
import JAVA6.Model.OrderModel;
import JAVA6.Model.ProductModel;
import JAVA6.Model.UserModel;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping; // Đảm bảo import @PutMapping
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
public class HistoryController {

    @Autowired
    private HistoryService historyService;
    @Autowired
    private OrderDetailService orderDetailService;
    @Autowired
    private OrderService orderService;
    @Autowired
    private UserService userService;
    @Autowired
    private ProductService productService;

    @Autowired
    private EvaluaesService evaluaesService;

    @PostMapping("/api/history")
    public List<OrderModel> getOrdersByUserId(@RequestBody UserRequest userRequest) {
        return historyService.getbyIdOrders(userRequest.getUserId());
    }

    @GetMapping("/api/history/{orderId}")
    public List<OrderDetailModel> getOrderDetails(@PathVariable int orderId) {
        return orderDetailService.getOrderDetailsByOrderId(orderId);
    }

    // API để hủy đơn hàng
    @PutMapping("/api/history/cancel/{orderId}")
    public ResponseEntity<String> cancelOrder(@PathVariable int orderId, @RequestBody CancelRequest cancelRequest) {
        try {
            orderService.cancelOrder(orderId, cancelRequest.getCancelReason());
            return new ResponseEntity<>("Đơn hàng đã được hủy thành công.", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Không thể hủy đơn hàng. Lỗi: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/api/history/evaluate")
    public ResponseEntity<String> submitEvaluation(
            @RequestParam("star") int star,
            @RequestParam("image") String image, // Handling image file upload
            @RequestParam("comment") String comment,
            @RequestParam("status") boolean status,
            @RequestParam("userId") int userId,
            @RequestParam("productId") int productId,
            @RequestParam("orderDetailId") Integer orderDetailId) {

        try {
            // Kiểm tra các ID hợp lệ
            if (productId == 0 || userId == 0) {
                return new ResponseEntity<>("Sản phẩm hoặc người dùng không hợp lệ.", HttpStatus.BAD_REQUEST);
            }
            EvaluateModel evaluateModel = new EvaluateModel();

            // Truy vấn các đối tượng từ ID
            ProductModel product = productService.getProductById(productId);
            UserModel user = userService.getUserById(userId);
            List<OrderDetailModel> orderDetails = orderDetailService
                    .getOrderDetailsByOrderId(orderDetailId);
            if (orderDetails == null || orderDetails.isEmpty()) {
                return new ResponseEntity<>("Không tìm thấy chi tiết đơn hàng.", HttpStatus.BAD_REQUEST);
            }
            OrderDetailModel orderDetail = orderDetails.get(0); // Chỉ truy cập nếu danh sách không rỗng

            // Kiểm tra nếu không tìm thấy đối tượng nào
            if (product == null || user == null || orderDetail == null) {
                return new ResponseEntity<>("Không tìm thấy sản phẩm, người dùng, hoặc chi tiết đơn hàng.",
                        HttpStatus.BAD_REQUEST);
            }

            // Tạo đối tượng EvaluateModel và thiết lập các trường
            evaluateModel.setStar(star);
            evaluateModel.setImg(image); // Assuming you want to save image bytes
            evaluateModel.setComment(comment);
            evaluateModel.setStatus(status);
            evaluateModel.setProduct(product);
            evaluateModel.setUser(user);
            evaluateModel.setOrderDetail(orderDetail);

            // Lưu vào cơ sở dữ liệu
            evaluaesService.saveEvaluation(evaluateModel);

            return new ResponseEntity<>("Đánh giá của bạn đã được gửi thành công!", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi khi gửi đánh giá: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Lớp CancelRequest phải là static
    public static class CancelRequest {
        private String cancelReason;

        public String getCancelReason() {
            return cancelReason;
        }

        public void setCancelReason(String cancelReason) {
            this.cancelReason = cancelReason;
        }
    }

    public static class UserRequest {
        private int userId;

        public int getUserId() {
            return userId;
        }

        public void setUserId(int userId) {
            this.userId = userId;
        }
    }
}
