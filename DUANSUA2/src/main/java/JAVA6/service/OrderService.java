package JAVA6.service;

import java.util.List;
import java.util.Optional;

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

    public OrderStatusModel getOrderStatusById(Integer id) {
        return orderStatusRepository.findById(id).orElse(null);
    }

    public OrderStatusModel getOrderStatusByName(String name) {
        return orderStatusRepository.findByStatus(name);
    }

    public List<OrderModel> getAllOrders() {
        return orderRepository.findAll();
    }

    public OrderModel getOrderById(int id) {
        return orderRepository.findById(id).orElse(null);
    }

    public void updateOrderStatus(int orderId, int orderStatusId) {
        OrderModel order = orderRepository.findById(orderId).orElse(null);
        OrderStatusModel status = orderStatusRepository.findById(orderStatusId).orElse(null);
        if (order != null && status != null) {
            order.setOrderStatus(status);
            orderRepository.save(order);
        }
    }

    public List<OrderStatusModel> getAllOrderStatuses() {
        return orderStatusRepository.findAll(); // Giả sử bạn có một phương thức findAll trong repository
    }

    public void deleteOrder(int orderId) {
        orderRepository.deleteById(orderId);
    }

    // tong

    public Long getTotalOrders() {
        return orderRepository.countTotalOrders();
    }

    public Double getTotalRevenue() {
        return orderRepository.getTotalRevenue(); // Gọi phương thức trong repository
    }

    public List<Object[]> getMonthlyRevenueByYear(Integer year) {
        return orderRepository.getMonthlyRevenueByYear(year);

    }

    // huy
    public void cancelOrder(int orderId, String cancelReason) {
        Optional<OrderModel> orderOptional = orderRepository.findById(orderId);
        if (!orderOptional.isPresent()) {
            throw new RuntimeException("Không tìm thấy đơn hàng với ID: " + orderId);
        }
        OrderModel order = orderOptional.get();

        Optional<OrderStatusModel> canceledStatusOptional = orderStatusRepository.findById(7);
        if (!canceledStatusOptional.isPresent()) {
            throw new RuntimeException("Không tìm thấy trạng thái 'Hủy' với ID: 7");
        }
        OrderStatusModel canceledStatus = canceledStatusOptional.get();

        // Cập nhật trạng thái đơn hàng thành 'Hủy' và lý do hủy
        order.setOrderStatus(canceledStatus);
        order.setCancelReason(cancelReason);
        orderRepository.save(order);
    }

}
