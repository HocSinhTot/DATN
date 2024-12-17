package JAVA6.service;

import JAVA6.Model.CartModel;
import JAVA6.Model.ColorModel;
import JAVA6.Model.ProductDetailsModel;
import JAVA6.Model.ProductModel;
import JAVA6.Model.ProductsPriceModel;
import JAVA6.Model.UserModel;
import JAVA6.repository.CartRepository;
import JAVA6.repository.ColorAdminRepository;
import JAVA6.repository.ProductRepository;
import JAVA6.repository.ProductdetailsRepository;
import JAVA6.repository.ProductdetailsRepositoryy;
import JAVA6.repository.ProductsPriceRepository;
import JAVA6.repository.UsersRepository;
import JAVA6.repository.CapacityAdminRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private ProductsPriceRepository productsPriceRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CapacityAdminRepository CapacityAdminRepository;
    @Autowired
    private ProductdetailsRepository productDetailRepository;
    @Autowired
    private ProductdetailsRepositoryy productDetailRepositoryy;
    @Autowired
    private ColorAdminRepository colorRepository;

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
    public CartModel addToCart(int userId, int productId, int colorId, int priceId, int quantity) {
        // Kiểm tra người dùng
        UserModel user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Người dùng không tồn tại."));

        // Lấy thông tin sản phẩm
        ProductModel product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Sản phẩm không tồn tại."));

        // Lấy thông tin màu sắc
        ColorModel color = colorRepository.findById(colorId)
                .orElseThrow(() -> new IllegalArgumentException("Màu sắc không tồn tại."));

        ProductsPriceModel price = productsPriceRepository.findById(priceId)
                .orElseThrow(() -> new IllegalArgumentException("Giá sản phẩm không tồn tại."));

        // Kiểm tra xem ProductDetailsModel đã tồn tại chưa
        ProductDetailsModel productDetail = productDetailRepository.findByProductAndColorAndProductPrice(product, color,
                price);

        if (productDetail == null) {
            // Nếu chưa tồn tại, tạo mới ProductDetailsModel
            productDetail = new ProductDetailsModel();
            productDetail.setProduct(product);
            productDetail.setColor(color);
            productDetail.setProductPrice(price);
            productDetail.setTotalQuantity(0); // Tổng số lượng ban đầu là 0
            productDetail = productDetailRepositoryy.save(productDetail);
        }

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        CartModel existingCartItem = cartRepository.findByUserAndProduct(user, productDetail);

        if (existingCartItem != null) {
            // Nếu đã có, cập nhật số lượng và tổng giá
            existingCartItem.setTotalQuantity(existingCartItem.getTotalQuantity() + quantity);

            BigDecimal updatedTotalPrice = existingCartItem.getTotalPrice()
                    .add(productDetail.getProductPrice().getPrice().multiply(BigDecimal.valueOf(quantity)));

            existingCartItem.setTotalPrice(updatedTotalPrice);

            return cartRepository.save(existingCartItem);
        } else {
            // Nếu chưa có, tạo mới sản phẩm trong giỏ hàng
            CartModel newCartItem = new CartModel();
            newCartItem.setUser(user);
            newCartItem.setProduct(productDetail);// Liên kết ProductDetail
            newCartItem.setTotalQuantity(quantity);

            BigDecimal totalPrice = productDetail.getProductPrice().getPrice().multiply(BigDecimal.valueOf(quantity));
            newCartItem.setTotalPrice(totalPrice);

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