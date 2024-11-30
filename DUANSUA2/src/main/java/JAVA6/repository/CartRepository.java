package JAVA6.repository;

import JAVA6.Model.CartModel;
import JAVA6.Model.UserModel;
import JAVA6.Model.ProductModel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CartRepository extends JpaRepository<CartModel, Long> {
    
    // Tìm tất cả các sản phẩm trong giỏ của người dùng
    List<CartModel> findByUser(UserModel user);
    
    // Tìm sản phẩm trong giỏ của người dùng theo productId
    CartModel findByUserAndProduct(UserModel user, ProductModel product);
    
    // Xóa sản phẩm khỏi giỏ của người dùng
    void deleteByUserAndProduct(UserModel user, ProductModel product);
}


