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

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.*;
import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

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
            // Lấy thông tin đơn hàng
            OrderModel order = orderService.getOrderById(orderId);
            if (order == null) {
                return new ResponseEntity<>("Không tìm thấy đơn hàng.", HttpStatus.NOT_FOUND);
            }

            // Lý do hủy đơn hàng
            order.setCancelReason(cancelRequest.getCancelReason());

            // Cập nhật trạng thái đơn hàng thành "Hủy"
            orderService.cancelOrder(orderId, cancelRequest.getCancelReason());

            // Kiểm tra nếu paymentmethod_id là 2 (VNPAY)
            if (order.getPaymentMethod() != null && order.getPaymentMethod().getId() == 2) {
                // Gửi email thông báo hủy đơn hàng cho người dùng
                sendCancelOrderEmail(order.getUser().getEmail(), orderId, order.getTotal(), order.getCancelReason());
            }

            return new ResponseEntity<>("Đơn hàng đã được hủy thành công.", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Không thể hủy đơn hàng. Lỗi: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Phương thức gửi email
    private void sendCancelOrderEmail(String userEmail, int orderId, BigDecimal total, String reason)
            throws MessagingException {
        Properties properties = new Properties();
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.starttls.enable", "true");
        properties.put("mail.smtp.host", "smtp.gmail.com");
        properties.put("mail.smtp.port", "587");

        String email = "dinhlhpc05738@fpt.edu.vn";
        String password = "dllr oinc rovw jcvr";

        Session session = Session.getInstance(properties, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(email, password);
            }
        });
        String formattedTotal = formatCurrency(total);

        Message message = new MimeMessage(session);
        message.setFrom(new InternetAddress(email));
        message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(userEmail));
        message.setSubject("Thông báo hủy đơn hàng");
        message.setText("Chúng tôi xin thông báo rằng mã đơn hàng " + orderId + " của bạn đã bị hủy.\n"
                + "Tổng tiền sản phẩm là: " + formattedTotal + ".\n"
                + "Với lí do hủy là: " + reason + ".\n"
                + "Vui lòng liên hệ với chúng tôi để được hoàn tiền.");

        Transport.send(message);
    }

    public String formatCurrency(BigDecimal amount) {
        NumberFormat currencyFormat = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));
        return currencyFormat.format(amount);
    }

    @PostMapping("/api/history/evaluate")
    public ResponseEntity<String> submitEvaluation(
            @RequestParam("star") int star,
            @RequestParam("image") String image, // Handling image file upload
            @RequestParam("comment") String comment,
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
            OrderDetailModel orderDetail = orderDetailService.getOrderDetailById(orderDetailId);
            if (orderDetail == null) {
                return new ResponseEntity<>("Không tìm thấy chi tiết đơn hàng.", HttpStatus.BAD_REQUEST);
            }

            // Kiểm tra nếu không tìm thấy đối tượng nào
            if (product == null || user == null || orderDetail == null) {
                return new ResponseEntity<>("Không tìm thấy sản phẩm, người dùng, hoặc chi tiết đơn hàng.",
                        HttpStatus.BAD_REQUEST);
            }

            // Tạo đối tượng EvaluateModel và thiết lập các trường
            evaluateModel.setStar(star);
            evaluateModel.setImg(image); // Assuming you want to save image bytes
            evaluateModel.setComment(comment);
            evaluateModel.setStatus(false);
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

    @PostMapping("/api/history/{orderId}/updateStatus")
    public ResponseEntity<String> updateOrderStatus(
            @PathVariable Integer orderId,
            @RequestBody OrderStatusUpdateRequest request) {
        orderService.updateOrderStatus(orderId, request.getStatusId());
        return ResponseEntity.ok("Order status updated successfully");
    }

    // DTO class to handle status update request (for POST method)
    public static class OrderStatusUpdateRequest {
        private Integer orderId;
        private Integer statusId;

        // Getters and Setters
        public Integer getOrderId() {
            return orderId;
        }

        public void setOrderId(Integer orderId) {
            this.orderId = orderId;
        }

        public Integer getStatusId() {
            return statusId;
        }

        public void setStatusId(Integer statusId) {
            this.statusId = statusId;
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