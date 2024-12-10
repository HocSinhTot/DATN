package JAVA6.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import JAVA6.Model.OrderModel;
import JAVA6.repository.OrderRepository;

@Service
public class HistoryService {
	@Autowired
    private OrderRepository orderRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Phương thức lấy đơn hàng theo ID
    public List<OrderModel> getbyIdOrders(int id) {
        return orderRepository.findbyId(id); // Giả sử bạn có phương thức này trong repository
    }

    // Phương thức để cập nhật trạng thái đơn hàng sau khi hủy
    public void updateOrderStatus(OrderModel order) {
        String sql = "UPDATE Orders SET status = ? WHERE id = ?";
        jdbcTemplate.update(sql, order.getStatus(), order.getId()); // Cập nhật trạng thái
    }

}