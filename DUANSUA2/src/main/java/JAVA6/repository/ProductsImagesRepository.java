package JAVA6.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import JAVA6.Model.ImageModel;
import JAVA6.Model.ProductsImagesModel;

public interface ProductsImagesRepository
        extends JpaRepository<ProductsImagesModel, ProductsImagesModel.ProductsImagesId> {

    // Tìm kiếm tất cả các hình ảnh liên kết với một sản phẩm
    List<ProductsImagesModel> findByProductId(int productId);

    // Tìm kiếm tất cả các hình ảnh liên kết với một màu sắc và sản phẩm
    List<ProductsImagesModel> findByProductIdAndColorId(int productId, int colorId);
}