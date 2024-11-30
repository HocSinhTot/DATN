package JAVA6.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import JAVA6.Model.ProductsPriceModel;
import JAVA6.Model.ProductsPriceModel.ProductsPriceId;

public interface CapacityRepository extends JpaRepository<ProductsPriceModel, ProductsPriceId> {
    List<ProductsPriceModel> findByIdProductId(Integer productId);
}