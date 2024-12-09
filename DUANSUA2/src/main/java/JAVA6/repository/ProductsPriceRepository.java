package JAVA6.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import JAVA6.Model.ProductsPriceModel;

@Repository
public interface ProductsPriceRepository extends JpaRepository<ProductsPriceModel, ProductsPriceModel.ProductsPriceId> {

    // Truy vấn theo productId
    List<ProductsPriceModel> findByIdProductId(int productId);

    // Truy vấn kết hợp capacityId và colorId
    List<ProductsPriceModel> findByIdCapacityIdAndIdColorId(int capacityId, int colorId);
}
