package JAVA6.repository;

import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import JAVA6.Model.BrandModel;
import JAVA6.Model.CategoryModel;
import JAVA6.Model.ColorModel;
import JAVA6.Model.ProductDetailsModel;
import JAVA6.Model.ProductModel;
import JAVA6.Model.ProductsPriceModel;

@Repository
public interface ProductdetailsRepository extends JpaRepository<ProductModel, Integer> {

    // Lấy tất cả sản phẩm theo thứ tự giảm dần của giá
    List<ProductModel> findAllByOrderByPriceDesc();

    // Lấy tất cả sản phẩm theo thứ tự tăng dần của giá
    List<ProductModel> findAllByOrderByPriceAsc();

    // Truy vấn tùy chỉnh: Tìm các dung lượng và giá dựa trên productId
    @Query(value = "SELECT DISTINCT pp.capacity_id AS capacityId, c.name AS capacityName, pp.price AS price " +
            "FROM ProductsPrice pp " +
            "JOIN Capacity c ON pp.capacity_id = c.id " +
            "WHERE pp.product_id = :productId", nativeQuery = true)
    List<Map<String, Object>> findCapacitiesAndPricesByProductId(@Param("productId") int productId);
  
    @Query(value = "SELECT DISTINCT pp.color_id AS colorId, c.name AS colorName " +
            "FROM ProductColor pp " +
            "JOIN Color c ON pp.color_id = c.id " +
            "WHERE pp.product_id = :productId", nativeQuery = true)
    List<Map<String, Object>> findProductColor(@Param("productId") int productId);
    @Query("SELECT p FROM ProductModel p WHERE p.category.id = :categoryId OR p.brand.id = :brandId")
    List<ProductModel> findByCategoryIdOrBrandId(@Param("categoryId") int categoryId,
            @Param("brandId") int brandId);
            @Query("SELECT p FROM ProductDetailsModel p WHERE p.product = :product AND p.color = :color AND p.productPrice = :productPrice")
    ProductDetailsModel findByProductAndColorAndProductPrice(
            @Param("product") ProductModel product,
            @Param("color") ColorModel color,
            @Param("productPrice") ProductsPriceModel productPrice);
}
