package JAVA6.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import JAVA6.Model.CategoryModel;

public interface CategoryRepository extends JpaRepository<CategoryModel, Integer> {
    CategoryModel findCategoryModelByName(String name);
    
    @Query("SELECT c.id AS categoryId, c.name AS categoryName, b.id AS brandId, b.name AS brandName " +
           "FROM ProductModel p " +
           "INNER JOIN p.brand b " +
           "INNER JOIN p.category c " +
           "WHERE c.id = :categoryId")
    List<CategoryModel> findbrandByCate(@Param("categoryId") int categoryId);
}
