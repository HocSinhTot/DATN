package JAVA6.users.controller;

import JAVA6.service.EvaluaesService;
import JAVA6.service.HistoryService;
import JAVA6.service.OrderDetailService;
import JAVA6.service.OrderService; // Đảm bảo import service OrderService
import JAVA6.Model.EvaluateModel;
import JAVA6.Model.OrderDetailModel;
import JAVA6.Model.OrderModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping; // Đảm bảo import @PutMapping
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
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
public ResponseEntity<String> submitEvaluation(@RequestBody EvaluateModel evaluateModel) {
    try {
        evaluaesService.saveEvaluation(evaluateModel);  // Lưu trực tiếp đối tượng evaluateModel mà không cần tạo mới
        return new ResponseEntity<>("Đánh giá của bạn đã được gửi thành công!", HttpStatus.OK);
    } catch (Exception e) {
        // Thêm thông báo lỗi chi tiết
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
