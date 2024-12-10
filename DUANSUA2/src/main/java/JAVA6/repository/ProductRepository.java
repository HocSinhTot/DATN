package JAVA6.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import JAVA6.Model.ProductModel;

import java.math.BigDecimal;
import java.util.List;

public interface ProductRepository extends JpaRepository<ProductModel, Integer> {
    List<ProductModel> findByNameContainingIgnoreCase(String name);
    // Phương thức tìm kiếm sản phẩm nâng cao với phân trang
    @Query("SELECT p FROM ProductModel p " +
           "WHERE (:categoryId IS NULL OR p.category.id = :categoryId) " +
           "AND (:brandId IS NULL OR p.brand.id = :brandId) " +
           "AND (:minPrice IS NULL OR p.price >= :minPrice) " +
           "AND (:maxPrice IS NULL OR p.price <= :maxPrice) " +
           "AND (:keyword IS NULL OR p.name LIKE %:keyword% OR p.description LIKE %:keyword%)")
    Page<ProductModel> findByFilters(
        @Param("categoryId") Integer categoryId,
        @Param("brandId") Integer brandId,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice,
        @Param("keyword") String keyword,
        Pageable pageable
    );
}
