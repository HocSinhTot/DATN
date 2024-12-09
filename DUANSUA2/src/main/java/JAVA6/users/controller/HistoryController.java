package JAVA6.users.controller;

import JAVA6.service.HistoryService;
import JAVA6.service.OrderDetailService;
import JAVA6.service.OrderService; // Đảm bảo import service OrderService
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
    private OrderService orderService; // Thêm OrderService để xử lý việc hủy đơn hàng

    // Xử lý POST request và lấy userId từ body request
    @PostMapping("/api/history")
    public List<OrderModel> getOrdersByUserId(@RequestBody UserRequest userRequest) {
        return historyService.getbyIdOrders(userRequest.getUserId());
    }

    // Xử lý GET request và lấy thông tin chi tiết đơn hàng theo orderId
    @GetMapping("/api/history/{orderId}")
    public List<OrderDetailModel> getOrderDetails(@PathVariable int orderId) {
        // Trả về danh sách chi tiết của đơn hàng
        return orderDetailService.getOrderDetailsByOrderId(orderId);
    }

    // API để hủy đơn hàng

}

// Định nghĩa lớp UserRequest để nhận userId từ body
class UserRequest {
    private int userId;

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }
}
