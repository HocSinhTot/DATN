package JAVA6.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import JAVA6.Model.OrderModel;
import JAVA6.Model.ProductModel;

@Repository
// Đảm bảo đánh dấu interface là Repository với các đối tượng OrderModel,
// Integer là kiểu của ID
public interface OrderRepository extends JpaRepository<OrderModel, Integer> {
	// Các phương thức tùy chỉnh có thể được thêm vào đây nếu cần
	@Query("SELECT p FROM OrderModel p WHERE p.user.id = ?1")
	List<OrderModel> findbyId(Integer userId);

	Optional<OrderModel> findById(Integer id); // Thay đổi kiểu tham số từ int sang Integer

	@Query("SELECT COUNT(o) FROM OrderModel o")
	Long countTotalOrders();

	@Query("SELECT SUM(o.total) FROM OrderModel o")
	Double getTotalRevenue();

	@Query("SELECT YEAR(o.date) AS Year, MONTH(o.date) AS Month, COUNT(o) AS TotalOrders, SUM(o.total) AS TotalAmount "
			+
			"FROM OrderModel o " +
			"WHERE YEAR(o.date) = :year " +
			"GROUP BY YEAR(o.date), MONTH(o.date) " +
			"ORDER BY Month")
	List<Object[]> getMonthlyRevenueByYear(@Param("year") Integer year);

}