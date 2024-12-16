package JAVA6.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import JAVA6.Model.OrderModel;
import JAVA6.Model.OrderStatusModel;
import JAVA6.repository.OrderRepository;
import JAVA6.repository.OrderStatusRepository;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderStatusRepository orderStatusRepository;

    // Lấy trạng thái đơn hàng theo ID
    public OrderStatusModel getOrderStatusById(Integer id) {
        return orderStatusRepository.findById(id).orElse(null);
    }

    // Lấy trạng thái đơn hàng theo tên
    public OrderStatusModel getOrderStatusByName(String name) {
        return orderStatusRepository.findByStatus(name);
    }

    // Lấy tất cả các đơn hàng
    public List<OrderModel> getAllOrders() {
        return orderRepository.findAll();
    }

    // Lấy đơn hàng theo ID
    public OrderModel getOrderById(int id) {
        return orderRepository.findById(id).orElse(null);
    }
    public void updateOrderStatus(int orderId, int orderStatusId) {
        OrderModel order = orderRepository.findById(orderId).orElse(null);  // Kiểm tra null nếu không tìm thấy
        OrderStatusModel status = orderStatusRepository.findById(orderStatusId).orElse(null);  // Kiểm tra null nếu không tìm thấy
    
        if (order != null && status != null) {
            order.setOrderStatus(status);  // Cập nhật trạng thái cho đơn hàng
            orderRepository.save(order);  // Lưu lại đơn hàng với trạng thái mới
        } else {
            // Bạn có thể xử lý lỗi nếu không tìm thấy đơn hàng hoặc trạng thái
            System.out.println("Order or Status not found");
        }
    }

    // Lấy tất cả các trạng thái đơn hàng
    public List<OrderStatusModel> getAllOrderStatuses() {
        return orderStatusRepository.findAll();
    }

    // Xóa đơn hàng theo ID
    public void deleteOrder(int orderId) {
        orderRepository.deleteById(orderId);
    }

    // Lấy tổng số đơn hàng
    public Long getTotalOrders() {
        return orderRepository.countTotalOrders();
    }

    // Lấy tổng doanh thu
    public Double getTotalRevenue() {
        return orderRepository.getTotalRevenue();
    }

    // Lấy doanh thu hàng tháng trong một năm
    public List<Object[]> getMonthlyRevenueByYear(Integer year) {
        return orderRepository.getMonthlyRevenueByYear(year);
    }
}
