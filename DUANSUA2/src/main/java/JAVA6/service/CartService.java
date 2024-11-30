package JAVA6.service;

import JAVA6.Model.CartModel;
import JAVA6.Model.ProductModel;
import JAVA6.Model.UserModel;
import JAVA6.repository.CartRepository;
import JAVA6.repository.ProductRepository;
import JAVA6.repository.UsersRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UsersRepository userRepository;

    // Lấy danh sách sản phẩm trong giỏ của người dùng
    public List<CartModel> getCartItemsByUser(int userId) {
        UserModel user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            throw new IllegalArgumentException("Người dùng không tồn tại.");
        }
        return cartRepository.findByUser(user);
    }

    // Thêm sản phẩm vào giỏ hàng
    public CartModel addToCart(int userId, int productId, int quantity) {
        // Kiểm tra người dùng
        UserModel user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            throw new IllegalArgumentException("Người dùng không tồn tại.");
        }

        // Lấy thông tin sản phẩm
        ProductModel product = productRepository.findById(productId).orElse(null);
        if (product == null) {
            throw new IllegalArgumentException("Sản phẩm không tồn tại.");
        }

        // Kiểm tra xem sản phẩm đã có trong giỏ hay chưa
        CartModel existingCartItem = cartRepository.findByUserAndProduct(user, product);

        if (existingCartItem != null) {
            // Nếu có, cập nhật số lượng và tổng giá
            existingCartItem.setTotalQuantity(existingCartItem.getTotalQuantity() + quantity);
            existingCartItem.setTotalPrice(
                    existingCartItem.getTotalPrice()
                            .add(
                                    product.getPrice().multiply(BigDecimal.valueOf(quantity))));

            return cartRepository.save(existingCartItem);
        } else {
            // Nếu chưa có, tạo mới sản phẩm trong giỏ hàng
            CartModel newCartItem = new CartModel();
            newCartItem.setUser(user);
            newCartItem.setProduct(product); // Sử dụng ProductModel thay vì productId
            newCartItem.setTotalQuantity(quantity);
            newCartItem.setTotalPrice(
                    product.getPrice().multiply(BigDecimal.valueOf(quantity))
            );
            return cartRepository.save(newCartItem);
        }
    }

    // Xóa sản phẩm khỏi giỏ hàng
    public void removeFromCart(int userId, int productId) {
        // Kiểm tra người dùng và sản phẩm
        UserModel user = userRepository.findById(userId).orElse(null);
        ProductModel product = productRepository.findById(productId).orElse(null);
        if (user == null || product == null) {
            throw new IllegalArgumentException("Người dùng hoặc sản phẩm không tồn tại.");
        }

        // Xóa sản phẩm khỏi giỏ
        cartRepository.deleteByUserAndProduct(user, product);
    }
}
