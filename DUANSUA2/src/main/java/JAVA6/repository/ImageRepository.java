package JAVA6.repository;

import JAVA6.Model.ImageModel;
import JAVA6.Model.ProductModel;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ImageRepository extends JpaRepository<ImageModel, Integer> {
      @Query("SELECT i FROM ImageModel i JOIN FETCH i.product")
    List<ImageModel> findAllWithProducts();
}
