package JAVA6.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import JAVA6.Model.ProductsPriceModel;

@Repository
public interface ProductsPriceRepository extends JpaRepository<ProductsPriceModel, Integer> {

    // // Truy vấn theo productId
    // List<ProductsPriceModel> findByIdProductId(int product);

    // // Truy vấn kết hợp capacityId và colorId
    // List<ProductsPriceModel> findByIdCapacityIdAndId(int capacity);
}
