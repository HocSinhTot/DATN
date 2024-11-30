package JAVA6.users.controller;

import JAVA6.Model.CartModel;
import JAVA6.Model.CartRequest;
import JAVA6.Model.OrderDetailModel;
import JAVA6.Model.OrderModel;
import JAVA6.Model.OrderStatusModel;
import JAVA6.Model.PaymentMethodModel;
import JAVA6.Model.PaymentRequest;
import JAVA6.Model.ProductModel;
import JAVA6.Model.UserModel;
import JAVA6.repository.CartRepository;
import JAVA6.repository.OrderDetailRepository;
import JAVA6.repository.OrderRepository;
import JAVA6.repository.OrderStatusRepository;
import JAVA6.repository.PaymentMethodRepository;
import JAVA6.service.ProductService;
import JAVA6.service.UserService;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

// import java.math.BigDecimal;
// import java.sql.Timestamp;
// import java.util.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductService productService;
    @Autowired
    private OrderStatusRepository orderStatusRepository;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private OrderDetailRepository orderDetailRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private PaymentMethodRepository paymentMethodRepository;
    // Xem giỏ hàng
    @GetMapping("/viewCart")
    public ResponseEntity<Map<String, Object>> viewCart(@RequestParam("userId") Integer userId) {

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Vui lòng đăng nhập để xem giỏ hàng."));
        }

        UserModel user = userService.getUserById(userId);
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Người dùng không tồn tại"));
        }

        List<CartModel> cartItems = cartRepository.findByUser(user);
        BigDecimal totalAmount = cartItems.stream()
                .map(CartModel::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> response = new HashMap<>();
        response.put("cartItems", cartItems);
        response.put("totalAmount", totalAmount);

        return ResponseEntity.ok(response);
    }

    // Thêm sản phẩm vào giỏ hàng
    @PostMapping("/addToCart")
    public ResponseEntity<Map<String, String>> addToCart(@RequestParam("productId") int productId,
                                                          @RequestParam("quantity") int quantity,
                                                          @RequestParam("userId") Integer userId) {
    
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Vui lòng đăng nhập để thêm sản phẩm vào giỏ."));
        }
    
        UserModel user = userService.getUserById(userId);
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Người dùng không tồn tại"));
        }
    
        ProductModel product = productService.getProductById(productId);
        if (product == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Sản phẩm không tồn tại"));
        }
    
        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        CartModel existingCartItem = cartRepository.findByUserAndProduct(user, product);
        if (existingCartItem != null) {
            // Nếu có, cập nhật số lượng và giá
            existingCartItem.setUser(user);
            existingCartItem.setProduct(product);
            existingCartItem.setTotalQuantity(existingCartItem.getTotalQuantity() + quantity);
            existingCartItem.setTotalPrice(existingCartItem.getTotalPrice().add(product.getPrice().multiply(BigDecimal.valueOf(quantity))));
            cartRepository.save(existingCartItem);
        
        } else {
            // Nếu chưa có, tạo mới sản phẩm trong giỏ
            CartModel cartItem = new CartModel(user, product, quantity, product.getPrice().multiply(BigDecimal.valueOf(quantity)));
            cartRepository.save(cartItem);
        }
    
        return ResponseEntity.ok(Map.of(
            "message", "Sản phẩm đã được thêm vào giỏ.",
            "redirectUrl", "/cart" // URL để frontend chuyển hướng
        ));    
    }
     
    // Cập nhật số lượng sản phẩm trong giỏ hàng
    @PostMapping("/updateQuantity")
    public ResponseEntity<Map<String, String>> updateQuantity(@RequestParam("productId") int productId,
                                                               @RequestParam("quantity") int quantity,
                                                               @RequestParam("userId") Integer userId) {
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Vui lòng đăng nhập để cập nhật giỏ hàng."));
        }
    
        UserModel user = userService.getUserById(userId);
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Người dùng không tồn tại."));
        }
    
        ProductModel product = productService.getProductById(productId);
        if (product == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Sản phẩm không tồn tại."));
        }
    
        CartModel cartItem = cartRepository.findByUserAndProduct(user, product);
        if (cartItem == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Sản phẩm này chưa có trong giỏ hàng."));
        }
    
        if (quantity <= 0) {
            cartRepository.delete(cartItem);
            return ResponseEntity.ok(Map.of("message", "Sản phẩm đã bị xóa khỏi giỏ hàng do số lượng <= 0."));
        }
    
        cartItem.setTotalQuantity(quantity);
        cartItem.setTotalPrice(product.getPrice().multiply(BigDecimal.valueOf(quantity)));
        cartRepository.save(cartItem);
    
        return ResponseEntity.ok(Map.of("message", "Số lượng sản phẩm trong giỏ hàng đã được cập nhật."));
    }
    
    // Xóa sản phẩm khỏi giỏ hàng
    @PostMapping("/removeFromCart")
    public ResponseEntity<Map<String, String>> removeFromCart(@RequestParam("productId") int productId,
                                                              @RequestParam("userId") Integer userId) {
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Vui lòng đăng nhập để xóa sản phẩm khỏi giỏ hàng."));
        }
    
        UserModel user = userService.getUserById(userId);
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Người dùng không tồn tại."));
        }
    
        ProductModel product = productService.getProductById(productId);
        if (product == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Sản phẩm không tồn tại."));
        }
    
        CartModel cartItem = cartRepository.findByUserAndProduct(user, product);
        if (cartItem == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Sản phẩm không có trong giỏ hàng."));
        }
    
        cartRepository.delete(cartItem);
    
        return ResponseEntity.ok(Map.of("message", "Sản phẩm đã được xóa khỏi giỏ hàng."));
    }
    
    // Xóa tất cả sản phẩm trong giỏ hàng
    @PostMapping("/clearCart")
    public ResponseEntity<Map<String, String>> clearCart(@RequestParam("userId") Integer userId) {
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Vui lòng đăng nhập để xóa giỏ hàng."));
        }
    
        UserModel user = userService.getUserById(userId);
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Người dùng không tồn tại."));
        }
    
        List<CartModel> cartItems = cartRepository.findByUser(user);
        if (cartItems.isEmpty()) {
            return ResponseEntity.ok(Map.of("message", "Giỏ hàng đã trống."));
        }
    
        cartRepository.deleteAll(cartItems);
    
        return ResponseEntity.ok(Map.of("message", "Tất cả sản phẩm đã được xóa khỏi giỏ hàng."));
    }

    // Xử lý đơn hàng và thanh toán
    @PostMapping("/invoice")
    public ResponseEntity<Map<String, Object>> generateInvoice(@RequestBody CartRequest cartRequest) {
        List<ProductModel> cartItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;
    
        for (Map.Entry<Integer, Integer> entry : cartRequest.getCart().entrySet()) {
            ProductModel product = productService.getProductById(entry.getKey());
            if (product != null) {
                product.setQuantity(entry.getValue());
                cartItems.add(product);
                totalAmount = totalAmount.add(product.getTotalPrice());
            }
        }
    
        // Tạo dữ liệu hóa đơn để trả về client
        Map<String, Object> invoiceData = new HashMap<>();
        invoiceData.put("cartItems", cartItems);
        invoiceData.put("totalAmount", totalAmount);
        invoiceData.put("currentTime", new Date());
    
        return ResponseEntity.ok(invoiceData); // Trả về dữ liệu hóa đơn cho client
    }
  // Xử lý đơn hàng và thanh toán
  @PostMapping("/order/redirectPayment")
  public ResponseEntity<Map<String, Object>> processOrder(
          @RequestBody PaymentRequest paymentRequest, RedirectAttributes redirectAttributes) {
  
      // Lấy thông tin người dùng từ database
      UserModel user = userService.getUserById(paymentRequest.getUserId());  // Sử dụng paymentRequest.getUserId()
     

      // Lấy đối tượng PaymentMethod từ database theo payMethodId
      PaymentMethodModel paymentMethod = paymentMethodRepository.findById(paymentRequest.getPayMethod())
              .orElseThrow(() -> new RuntimeException("Phương thức thanh toán không hợp lệ"));
  
      // Xử lý thanh toán VNPay
      if (paymentRequest.getPayMethod() == 2) {
          Map<String, Object> response = new HashMap<>();
          response.put("paymentUrl", "http://vnPayUrl.com"); // URL thanh toán VNPay
          return ResponseEntity.ok(response);
      }
  
      // Thanh toán COD, lưu đơn hàng
      OrderModel order = new OrderModel();
      order.setDate(new Timestamp(System.currentTimeMillis())); // Set thời gian
      order.setAddress(paymentRequest.getAddress()); // Địa chỉ giao hàng
      order.setUser(user); // Người mua
      order.setTotal(paymentRequest.getTotalAmount()); // Tổng giá trị
      order.setPaymentMethod(paymentMethod); // Phương thức thanh toán
      order.setOrderStatus(orderStatusRepository.getReferenceById( 1)); // Đơn hàng mới tạo
  
      orderRepository.save(order);
  
      // Lưu chi tiết đơn hàng
      List<CartModel> cartItems = cartRepository.findByUser(user);
      for (CartModel cartItem : cartItems) {
          OrderDetailModel orderDetail = new OrderDetailModel();
          orderDetail.setProduct(cartItem.getProduct());
          orderDetail.setOrder(order);
          orderDetail.setTotalQuantity(cartItem.getTotalQuantity());
          orderDetail.setTotalPrice(cartItem.getTotalPrice());
          orderDetailRepository.save(orderDetail);
      }
  
      // Xóa giỏ hàng sau khi đặt hàng
      cartRepository.deleteAll(cartItems);
  
      Map<String, Object> response = new HashMap<>();
      response.put("message", "Đặt hàng thành công.");
      return ResponseEntity.ok(response);
  }
}  
