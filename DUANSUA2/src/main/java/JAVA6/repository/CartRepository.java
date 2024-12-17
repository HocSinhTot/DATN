package JAVA6.repository;

import JAVA6.Model.CartModel;
import JAVA6.Model.ColorModel;
import JAVA6.Model.ProductDetailsModel;
import JAVA6.Model.UserModel;
import JAVA6.Model.ProductModel;
import JAVA6.Model.ProductsPriceModel;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CartRepository extends JpaRepository<CartModel, Integer> {

    // Tìm tất cả các sản phẩm trong giỏ của người dùng
    List<CartModel> findByUser(UserModel user);

    CartModel findByUserAndProduct(UserModel user, ProductModel productModel);

    CartModel findByUserAndProduct(UserModel user, ProductDetailsModel productDetail);

    // Tìm sản phẩm trong giỏ của người dùng theo productId
    CartModel findByUserAndProduct_ProductAndProduct_ColorAndProduct_ProductPrice(
            UserModel user, ProductModel product, ColorModel color, ProductsPriceModel productPrice);

    // Xóa sản phẩm khỏi giỏ của người dùng
    void deleteByUserAndProduct(UserModel user, ProductModel product);
}