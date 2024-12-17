package JAVA6.users.controller;

import JAVA6.Model.CartModel;
import JAVA6.Model.CartRequest;
import JAVA6.Model.ColorModel;
import JAVA6.Model.ImageModel;
import JAVA6.Model.OrderDetailModel;
import JAVA6.Model.OrderModel;
import JAVA6.Model.OrderStatusModel;
import JAVA6.Model.PaymentMethodModel;
import JAVA6.Model.PaymentRequest;
import JAVA6.Model.ProductDetailsModel;
import JAVA6.Model.ProductModel;
import JAVA6.Model.ProductsPriceModel;
import JAVA6.Model.UserModel;
import JAVA6.config.VnPayConfig;
import JAVA6.repository.CapacityAdminRepository;
import JAVA6.repository.CartRepository;
import JAVA6.repository.ColorAdminRepository;
import JAVA6.repository.OrderDetailRepository;
import JAVA6.repository.OrderRepository;
import JAVA6.repository.OrderStatusRepository;
import JAVA6.repository.PaymentMethodRepository;
import JAVA6.repository.ProductRepository;
import JAVA6.repository.ProductdetailsRepositoryy;
import JAVA6.repository.ProductsPriceRepository;
import JAVA6.service.ProductService;
import JAVA6.service.ProductsPriceService;
import JAVA6.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private ProductService productService;
    @Autowired
    private ProductsPriceService productsPriceService;
    @Autowired
    private ColorAdminRepository colorAdminRepository;
    @Autowired
    private ProductdetailsRepositoryy productDetailsRepositoryy;
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CapacityAdminRepository capacityAdminRepository;
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
    // Thêm sản phẩm vào giỏ hàng
    @PostMapping("/addToCart")
    public ResponseEntity<Map<String, String>> addToCart(@RequestParam("productId") int productId,
            @RequestParam("quantity") int quantity,
            @RequestParam("userId") Integer userId,
            @RequestParam("colorId") int colorId, // Lấy thông tin màu sắc từ frontend
            @RequestParam("capacity") int capacityId) { // Lấy thông tin dung lượng từ frontend

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Vui lòng đăng nhập để thêm sản phẩm vào giỏ."));
        }

        // Lấy thông tin người dùng từ database
        UserModel user = userService.getUserById(userId);
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Người dùng không tồn tại"));
        }

        // Lấy thông tin sản phẩm chính từ database (Product)
        ProductModel product = productService.getProductById(productId);
        if (product == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Sản phẩm không tồn tại"));
        }

        // Lấy màu sắc từ ColorModel
        Optional<ColorModel> selectedColorOpt = colorAdminRepository.findById(colorId);
        if (!selectedColorOpt.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Màu sắc không hợp lệ"));
        }
        ColorModel selectedColor = selectedColorOpt.get();

        // Lấy thông tin dung lượng từ ProductPriceModel
        ProductsPriceModel selectedPrice = productsPriceService.getPriceByProductAndCapacity(productId, capacityId);
        if (selectedPrice == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Dung lượng không hợp lệ"));
        }

        // Tạo ProductDetailsModel mới với các thông tin màu sắc và dung lượng
        ProductDetailsModel productDetails = new ProductDetailsModel();
        productDetails.setProduct(product);
        productDetails.setColor(selectedColor);
        productDetails.setProductPrice(selectedPrice);
        productDetails = productDetailsRepositoryy.save(productDetails);

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        CartModel existingCartItem = cartRepository.findByUserAndProduct_ProductAndProduct_ColorAndProduct_ProductPrice(
                user, product, selectedColor, selectedPrice);
        if (existingCartItem != null) {
            // Nếu có, cập nhật số lượng và giá
            existingCartItem.setUser(user);
            existingCartItem.setProduct(productDetails); // Đảm bảo rằng productDetails được set lại

            // Cập nhật số lượng và tính lại giá
            existingCartItem.setTotalQuantity(existingCartItem.getTotalQuantity() + quantity);
            BigDecimal updatedPrice = productDetails.getProductPrice().getPrice()
                    .multiply(BigDecimal.valueOf(existingCartItem.getTotalQuantity()));
            existingCartItem.setTotalPrice(updatedPrice);

            cartRepository.save(existingCartItem);
        } else {
            // Nếu chưa có, tạo mới sản phẩm trong giỏ
            BigDecimal price = productDetails.getProductPrice().getPrice();
            CartModel cartItem = new CartModel(user, productDetails, quantity,
                    price.multiply(BigDecimal.valueOf(quantity)));
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
            @RequestParam("userId") Integer userId, @RequestParam("colorId") int colorId, // Lấy thông tin màu sắc từ
                                                                                          // frontend
            @RequestParam("capacity") int capacityId) {
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
            return ResponseEntity.badRequest().body(Map.of("message", "Sản phẩm không tồn tại"));
        }
        ProductDetailsModel productDetails = productService.getProductDetailsById(productId);
        if (productDetails == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Sản phẩm không tồn tại."));
        }
        Optional<ColorModel> selectedColorOpt = colorAdminRepository.findById(colorId);
        if (!selectedColorOpt.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Màu sắc không hợp lệ"));
        }
        ColorModel selectedColor = selectedColorOpt.get();

        // Lấy thông tin dung lượng từ ProductPriceModel
        ProductsPriceModel selectedPrice = productsPriceService.getPriceByProductAndCapacity(productId, capacityId);
        if (selectedPrice == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Dung lượng không hợp lệ"));
        }
        CartModel cartItem = cartRepository.findByUserAndProduct_ProductAndProduct_ColorAndProduct_ProductPrice(user,
                product, selectedColor, selectedPrice);
        if (cartItem == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Sản phẩm này chưa có trong giỏ hàng."));
        }

        if (quantity <= 0) {
            cartRepository.delete(cartItem);
            return ResponseEntity.ok(Map.of("message", "Sản phẩm đã bị xóa khỏi giỏ hàng do số lượng <= 0."));
        }

        cartItem.setTotalQuantity(quantity);
        cartItem.setTotalPrice(productDetails.getPrice().multiply(BigDecimal.valueOf(quantity)));
        cartRepository.save(cartItem);

        return ResponseEntity.ok(Map.of("message", "Số lượng sản phẩm trong giỏ hàng đã được cập nhật."));
    }

    // Xóa sản phẩm khỏi giỏ hàng
    @PostMapping("/removeFromCart")
    public ResponseEntity<Map<String, String>> removeFromCart(@RequestParam("productId") int productId,
            @RequestParam("userId") Integer userId, @RequestParam("colorId") int colorId, // Lấy thông tin màu sắc từ
                                                                                          // frontend
            @RequestParam("capacity") int capacityId) {
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
            return ResponseEntity.badRequest().body(Map.of("message", "Sản phẩm không tồn tại"));
        }
        ProductDetailsModel productDetails = productService.getProductDetailsById(productId);
        if (productDetails == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Sản phẩm không tồn tại."));
        }
        Optional<ColorModel> selectedColorOpt = colorAdminRepository.findById(colorId);
        if (!selectedColorOpt.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Màu sắc không hợp lệ"));
        }
        ColorModel selectedColor = selectedColorOpt.get();

        // Lấy thông tin dung lượng từ ProductPriceModel
        ProductsPriceModel selectedPrice = productsPriceService.getPriceByProductAndCapacity(productId, capacityId);
        if (selectedPrice == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Dung lượng không hợp lệ"));
        }
        CartModel cartItem = cartRepository.findByUserAndProduct_ProductAndProduct_ColorAndProduct_ProductPrice(user,
                product, selectedColor, selectedPrice);
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
        List<Map<String, Object>> cartItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;
        Integer userId = cartRequest.getUserId();

        // Kiểm tra nếu userId không có
        if (userId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "User ID is required"));
        }

        // Duyệt qua các sản phẩm trong giỏ hàng
        for (Map.Entry<Integer, Integer> entry : cartRequest.getCart().entrySet()) {
            // Lấy thông tin chi tiết sản phẩm từ productId
            ProductDetailsModel productDetails = productService.getProductDetailsById(entry.getKey());
            System.out.println("productID " + productDetails.getProduct().getId());
            ProductModel product = productService.getProductById(productDetails.getProduct().getId());
            if (productDetails != null) {
                Integer colorId = productDetails.getColor().getId(); // Màu sắc từ cartRequest
                int quantity = entry.getValue(); // Số lượng sản phẩm

                // Lấy tên màu sắc từ ColorModel
                Optional<ColorModel> colorOpt = colorAdminRepository.findById(colorId);
                String colorName = colorOpt.isPresent() ? colorOpt.get().getName() : "Không xác định";

                // Lấy thông tin dung lượng từ ProductsPriceModel (cần capacityId)
                ProductsPriceModel priceDetails = productsPriceService.getPriceByProductAndCapacity(
                        productDetails.getProduct().getId(), productDetails.getCapacityy());
                String capacityName = priceDetails != null ? priceDetails.getCapacity().getName() : "Không xác định";

                // Tính giá tổng cho sản phẩm
                BigDecimal productTotalPrice = productDetails.getPrice().multiply(BigDecimal.valueOf(quantity));
                List<ImageModel> images = product.getImages();
                String firstImageUrl = images.get(0).getUrl();
                // Tạo dữ liệu cho sản phẩm
                Map<String, Object> productData = new HashMap<>();
                productData.put("id", productDetails.getId());
                productData.put("name", productDetails.getProduct().getName());
                productData.put("price", productDetails.getPrice());
                productData.put("quantity", quantity);
                productData.put("image", firstImageUrl);
                productData.put("totalPrice", productTotalPrice);
                productData.put("color", colorName); // Thêm tên màu sắc
                productData.put("capacity", capacityName); // Thêm tên dung lượng
                cartItems.add(productData);

                // Cộng dồn tổng giá trị của hóa đơn
                totalAmount = totalAmount.add(productTotalPrice);
            }
        }

        // Trả lại dữ liệu hóa đơn
        Map<String, Object> invoiceData = new HashMap<>();
        invoiceData.put("userId", userId);
        invoiceData.put("items", cartItems);
        invoiceData.put("totalAmount", totalAmount);

        return ResponseEntity.ok(invoiceData);
    }

    @PostMapping("/order/redirectPayment")
    public ResponseEntity<Map<String, Object>> processOrder(@RequestBody @Valid PaymentRequest paymentRequest) {
        UserModel user = userService.getUserById(paymentRequest.getUserId());
        if (user == null) {
            throw new RuntimeException("Không tìm thấy người dùng với ID: " + paymentRequest.getUserId());
        }
        PaymentMethodModel paymentMethod = paymentMethodRepository.findById(paymentRequest.getPayMethod())
                .orElseThrow(() -> new RuntimeException(
                        "Phương thức thanh toán không hợp lệ: " + paymentRequest.getPayMethod()));
        // Tạo đơn hàng tạm thời mà chưa lưu vào CSDL
        OrderModel order = createTempOrder(paymentRequest, user, paymentMethod);

        // Nếu phương thức thanh toán là VNPay
        if (paymentRequest.getPayMethod() == 2) {
            // Gọi API của PaymentController để lấy URL thanh toán VNPay
            ResponseEntity<Map> response = restTemplate.getForEntity(
                    "http://localhost:8080/api/payment/vnpay?amount=" + paymentRequest.getTotalAmount(), Map.class);
            String paymentUrl = (String) response.getBody().get("data");

            // Trả về URL thanh toán cho frontend
            return ResponseEntity.ok(Collections.singletonMap("paymentUrl", paymentUrl));
        } else {
            // Xử lý thanh toán COD
            OrderModel savedOrder = handleCodPayment(paymentRequest, user, paymentMethod);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Đặt hàng thành công.");
            response.put("orderId", savedOrder.getId());
            return ResponseEntity.ok(response);
        }
    }

    private OrderModel createTempOrder(PaymentRequest paymentRequest, UserModel user,
            PaymentMethodModel paymentMethod) {
        // Tạo đơn hàng tạm thời
        OrderModel order = new OrderModel();
        order.setDate(new Timestamp(System.currentTimeMillis()));
        order.setAddress(paymentRequest.getAddress());
        order.setUser(user);
        order.setTotal(paymentRequest.getTotalAmount());
        order.setPaymentMethod(paymentMethod);
        order.setOrderStatus(orderStatusRepository.getReferenceById(1)); // Trạng thái "Chờ xử lý"

        // Lấy giỏ hàng tạm thời của người dùng
        List<CartModel> cartItems = cartRepository.findByUser(user);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Giỏ hàng rỗng, không thể tạo đơn hàng");
        }

        // Không lưu vào CSDL ngay, chỉ trả về order để sau này lưu sau khi thanh toán
        // thành công
        return order;
    }

    @GetMapping("/order/vnpayReturn")
    public ResponseEntity<Map<String, Object>> handleVNPayReturn(HttpServletRequest request,
            @RequestParam Integer userId, @RequestParam String address) {
        // Lấy các tham số từ VNPay trả về
        Map<String, String> vnp_Params = new HashMap<>();
        request.getParameterMap().forEach((key, value) -> vnp_Params.put(key, value[0]));

        // Kiểm tra mã checksum (vnp_SecureHash) để xác minh tính toàn vẹn dữ liệu
        String vnp_SecureHash = vnp_Params.remove("vnp_SecureHash");
        String hashData = VnPayConfig.hashAllFields(vnp_Params); // Tạo chuỗi hash từ tham số
        String calculatedHash = VnPayConfig.hmacSHA512(VnPayConfig.secretKey, hashData);

        // Kiểm tra trạng thái giao dịch
        String vnp_ResponseCode = vnp_Params.get("vnp_ResponseCode");
        if (!"00".equals(vnp_ResponseCode)) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "Giao dịch không thành công"));
        }

        // Lưu đơn hàng sau khi xác minh giao dịch thành công
        UserModel user = userService.getUserById(userId);
        if (user == null) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "Người dùng không hợp lệ"));
        }

        // Lấy thông tin phương thức thanh toán VNPay
        PaymentMethodModel paymentMethod = paymentMethodRepository.findById(2)
                .orElseThrow(() -> new RuntimeException("Phương thức thanh toán VNPay không hợp lệ"));

        // Tạo đơn hàng sau khi thanh toán thành công
        OrderModel order = handleVNPayOrder(user, address, paymentMethod, vnp_Params);

        // Cập nhật trạng thái đơn hàng sau khi thanh toán thành công
        order.setOrderStatus(orderStatusRepository.getReferenceById(3)); // Trạng thái "đã thanh toán"
        orderRepository.save(order);

        // Trả về kết quả
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Đặt hàng thành công qua VNPay.");
        response.put("orderId", order.getId());

        return ResponseEntity.status(HttpStatus.FOUND)
                .header("Location", "http://localhost:3000/history")
                .body(response);
    }

    private OrderModel handleVNPayOrder(UserModel user, String address, PaymentMethodModel paymentMethod,
            Map<String, String> vnp_Params) {
        // Tạo đơn hàng sau khi thanh toán thành công

        OrderModel order = new OrderModel();
        order.setDate(new Timestamp(System.currentTimeMillis()));
        order.setAddress(address);
        order.setUser(user);
        BigDecimal amount = new BigDecimal(vnp_Params.get("vnp_Amount"));
        BigDecimal total = amount.divide(BigDecimal.valueOf(100), 0, RoundingMode.HALF_UP); // Chia và làm tròn 2 chữ số
                                                                                            // thập phân
        order.setTotal(total); // Giá trị từ VNPay là nhân 100
        order.setPaymentMethod(paymentMethod);
        order.setOrderStatus(orderStatusRepository.getReferenceById(1)); // Trạng thái mặc định là "Chờ xử lý"

        // Lấy sản phẩm trong giỏ hàng
        List<CartModel> cartItems = cartRepository.findByUser(user);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Giỏ hàng rỗng, không thể tạo đơn hàng");
        }

        orderRepository.save(order);

        for (CartModel cartItem : cartItems) {
            ProductModel product = cartItem.getProduct().getProduct();
            if (product.getQuantity() < cartItem.getTotalQuantity()) {
                throw new RuntimeException("Sản phẩm " + product.getName() + " không đủ hàng trong kho.");
            } else {
                product.setQuantity(product.getQuantity() - cartItem.getTotalQuantity());
                productRepository.save(product);
                OrderDetailModel orderDetail = new OrderDetailModel();
                orderDetail.setProduct(cartItem.getProduct());
                orderDetail.setOrder(order);
                orderDetail.setTotalQuantity(cartItem.getTotalQuantity());
                orderDetail.setTotalPrice(cartItem.getTotalPrice());
                orderDetailRepository.save(orderDetail);
            }
        }

        // Xóa giỏ hàng sau khi lưu đơn hàng
        cartRepository.deleteAll(cartItems);
        return order;
    }

    private OrderModel handleCodPayment(PaymentRequest paymentRequest, UserModel user,
            PaymentMethodModel paymentMethod) {
        // Logic tạo đơn hàng COD
        OrderModel order = new OrderModel();
        order.setDate(new Timestamp(System.currentTimeMillis()));
        order.setAddress(paymentRequest.getAddress());
        order.setUser(user);
        order.setTotal(paymentRequest.getTotalAmount());
        order.setPaymentMethod(paymentMethod);
        order.setOrderStatus(orderStatusRepository.getReferenceById(1));

        List<CartModel> cartItems = cartRepository.findByUser(user);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Giỏ hàng rỗng, không thể tạo đơn hàng");
        }

        orderRepository.save(order);

        for (CartModel cartItem : cartItems) {
            ProductModel product = cartItem.getProduct().getProduct();

            // Kiểm tra tồn kho trước khi tạo chi tiết đơn hàng
            if (product.getQuantity() < cartItem.getTotalQuantity()) {
                throw new RuntimeException("Sản phẩm " + product.getName() + " không đủ hàng trong kho.");
            } else {
                product.setQuantity(product.getQuantity() - cartItem.getTotalQuantity());
                productRepository.save(product);
                OrderDetailModel orderDetail = new OrderDetailModel();

                orderDetail.setProduct(cartItem.getProduct());
                orderDetail.setOrder(order);
                orderDetail.setTotalQuantity(cartItem.getTotalQuantity());
                orderDetail.setTotalPrice(cartItem.getTotalPrice());
                orderDetailRepository.save(orderDetail);
            }
        }

        cartRepository.deleteAll(cartItems);
        return order;
    }
}