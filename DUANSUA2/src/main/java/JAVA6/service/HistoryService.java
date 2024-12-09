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

	public List<OrderModel> getbyIdOrders(int id) {
		return orderRepository.findbyId(id); // Phương thức findAll() sẽ trả về danh sách tất cả các đơn hàng từ cơ sở
												// dữ liệu
	}

	public void cancelOrder(Long orderId, String cancelReason) {
		String sql = "UPDATE Orders SET orderstatus_id = 8, cancel_reason = ? WHERE id = ?";

		// Cập nhật trạng thái đơn hàng thành "Đã hủy" và lưu lý do hủy
		jdbcTemplate.update(sql, cancelReason, orderId);
	}
}