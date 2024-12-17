package JAVA6.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import JAVA6.Model.ProductsPriceModel;

@Repository
public interface ProductsPriceRepository extends JpaRepository<ProductsPriceModel, Integer> {
    Optional<ProductsPriceModel> findByProduct_IdAndCapacity_Id(int productId, int capacityId);

    // // Truy vấn theo productId
    // List<ProductsPriceModel> findByIdProductId(int product);

    // // Truy vấn kết hợp capacityId và colorId
    // List<ProductsPriceModel> findByIdCapacityIdAndId(int capacity);
}
