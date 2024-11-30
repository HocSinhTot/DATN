package JAVA6.repository;

import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import JAVA6.Model.BrandModel;
import JAVA6.Model.CategoryModel;
import JAVA6.Model.ProductModel;

@Repository
public interface ProductdetailsRepository extends JpaRepository<ProductModel, Integer> {

    // Lấy tất cả sản phẩm theo thứ tự giảm dần của giá
    List<ProductModel> findAllByOrderByPriceDesc();

    // Lấy tất cả sản phẩm theo thứ tự tăng dần của giá
    List<ProductModel> findAllByOrderByPriceAsc();

    // Thêm các phương thức khác nếu cần thiết, ví dụ:
    // List<ProductModel> findByCategoryOrderByPriceAsc(String category);
    
    @Query(value = "SELECT DISTINCT pp.capacity_id AS capacityId, c.name AS capacityName, pp.price AS price " +
    "FROM ProductsPrice pp " +
    "JOIN Capacity c ON pp.capacity_id = c.id " +
    "WHERE pp.product_id = :productId", nativeQuery = true)
List<Map<String, Object>> findCapacitiesAndPricesByProductId(@Param("productId") int productId);
@Query("SELECT p FROM ProductModel p WHERE p.category.id = :categoryId and p.brand.id = :brandId")
public List<ProductModel> findByCategoryIdOrBrandId(@Param("categoryId") CategoryModel categoryId, @Param("brandId") BrandModel brandId);

}
