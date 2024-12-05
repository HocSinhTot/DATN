package JAVA6.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import JAVA6.Model.DiscountCode_UseModel;

@Repository
public interface DiscountCode_UseRepository extends JpaRepository<DiscountCode_UseModel, Integer> {
    // Các phương thức tùy chỉnh nếu cần
}
