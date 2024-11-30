package JAVA6.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import JAVA6.Model.OrderModel;
import JAVA6.repository.OrderRepository;

@Service
public class HistoryService {
	 @Autowired
	    private OrderRepository orderRepository;

	    public List<OrderModel> getbyIdOrders(int id) {
	        return orderRepository.findbyId(id); // Phương thức findAll() sẽ trả về danh sách tất cả các đơn hàng từ cơ sở dữ liệu
	    }
}