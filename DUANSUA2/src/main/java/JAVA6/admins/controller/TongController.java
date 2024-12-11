package JAVA6.admins.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import JAVA6.service.OrderService;

@RestController
@RequestMapping("/api/orders")
public class TongController {
    @Autowired
    private OrderService orderService;

    @GetMapping("/total")
    public ResponseEntity<Long> getTotalOrders() {
        Long totalOrders = orderService.getTotalOrders();
        return ResponseEntity.ok(totalOrders);
    }

}
