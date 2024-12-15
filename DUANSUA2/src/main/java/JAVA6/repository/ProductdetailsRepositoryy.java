package JAVA6.repository;

import JAVA6.Model.ProductDetailsModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductdetailsRepositoryy extends JpaRepository<ProductDetailsModel, Integer> {
    // Thêm các phương thức tùy chỉnh nếu cần
}
