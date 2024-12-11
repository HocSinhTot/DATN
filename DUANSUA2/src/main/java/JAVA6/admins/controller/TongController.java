package JAVA6.admins.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import JAVA6.service.OrderService;
import JAVA6.service.ProductService;
import JAVA6.service.UsersService; // Make sure you have this service
import io.jsonwebtoken.lang.Collections;

@RestController
@RequestMapping("/api/orders")
public class TongController {
    @Autowired
    private OrderService orderService;
    @Autowired
    private UsersService usersService; // Add this to access user data

    @Autowired
    private ProductService productService; // Add this to access user data

    @GetMapping("/total")
    public ResponseEntity<Long> getTotalOrders() {
        Long totalOrders = orderService.getTotalOrders();
        return ResponseEntity.ok(totalOrders);
    }

    @GetMapping("/total-users") // New endpoint to fetch total users
    public ResponseEntity<Long> getTotalUsers() {
        Long totalUsers = usersService.getTotalCustomers(); // Ensure this method exists in your service
        return ResponseEntity.ok(totalUsers);
    }

    @GetMapping("/monthly-revenue")
    public ResponseEntity<List<Object[]>> getMonthlyRevenue(@RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {
        if (year != null && month != null) {
            List<Object[]> revenueData = orderService.getMonthlyRevenueByYearAndMonth(year, month);
            return ResponseEntity.ok(revenueData);
        }
        return ResponseEntity.badRequest().body(Collections.emptyList());
    }

    @GetMapping("/total-products")
    public ResponseEntity<Long> getTotalProducts() {
        Long totalProducts = productService.getTotalProducts(); // Tạo phương thức này trong ProductService
        return ResponseEntity.ok(totalProducts);

    }

    @GetMapping("/total-revenue")
    public ResponseEntity<Double> getTotalRevenue() {
        Double totalRevenue = orderService.getTotalRevenue(); // Tạo phương thức getTotalRevenue() trong OrderService
        return ResponseEntity.ok(totalRevenue);
    }

}