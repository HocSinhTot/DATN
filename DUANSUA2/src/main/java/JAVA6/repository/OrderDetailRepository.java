package JAVA6.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import JAVA6.Model.OrderDetailModel;

public interface OrderDetailRepository extends JpaRepository<OrderDetailModel, Integer> {

    List<OrderDetailModel> findByOrderId(int orderId);
    // Thêm các phương thức tùy chỉnh nếu cần
}
