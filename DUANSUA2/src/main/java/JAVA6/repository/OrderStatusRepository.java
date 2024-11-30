package JAVA6.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import JAVA6.Model.OrderStatusModel;

<<<<<<< HEAD
@Repository
public interface OrderStatusRepository extends JpaRepository<OrderStatusModel, Long> {
    OrderStatusModel findByStatus(String status);
}

=======
public interface OrderStatusRepository extends JpaRepository<OrderStatusModel, Integer> {
    List<OrderStatusModel> findAll();
}
>>>>>>> origin/filechuyen
