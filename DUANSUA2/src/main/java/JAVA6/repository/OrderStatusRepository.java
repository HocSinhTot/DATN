package JAVA6.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import JAVA6.Model.OrderStatusModel;

@Repository
public interface OrderStatusRepository extends JpaRepository<OrderStatusModel, Integer> {
    OrderStatusModel findByStatus(String status);

    OrderStatusModel findByName(String name);

   // OrderStatusModel getReferenceById(long l);
}

