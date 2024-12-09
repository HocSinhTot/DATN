package JAVA6.admins.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import JAVA6.Model.OrderDetailModel;
import JAVA6.Model.OrderModel;
import JAVA6.Model.OrderStatusModel;
import JAVA6.service.OrderDetailService;
import JAVA6.service.OrderService;

@RestController
@RequestMapping("/api/admin/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderDetailService orderDetailService;

    // API to get all orders
    @GetMapping
    public ResponseEntity<List<OrderModel>> listOrders() {
        List<OrderModel> orderList = orderService.getAllOrders();
        return ResponseEntity.ok(orderList); // Return orders as JSON
    }

    // // API to update order status
    // @PostMapping("/updateStatus")
    // public ResponseEntity<String> updateOrderStatus(@RequestBody
    // OrderStatusUpdateRequest request) {
    // orderService.updateOrderStatus(request.getOrderId(), request.getStatusId());
    // return ResponseEntity.ok("Order status updated successfully");
    // }

    // // API to get details of a specific order
    // @GetMapping("/{orderId}/details")
    // public ResponseEntity<OrderDetailsResponse>
    // viewOrderDetails(@PathVariable("orderId") int orderId) {
    // OrderModel order = orderService.getOrderById(orderId);
    // List<OrderDetailModel> orderDetails =
    // orderDetailService.getOrderDetailsByOrderId(orderId);

    // OrderDetailsResponse response = new OrderDetailsResponse(order,
    // orderDetails);
    // return ResponseEntity.ok(response);
    // }

    // // DTO class to handle status update request (for POST method)
    // public static class OrderStatusUpdateRequest {
    // private Integer orderId;
    // private Integer statusId;

    // // Getters and Setters
    // public Integer getOrderId() {
    // return orderId;
    // }

    // public void setOrderId(Integer orderId) {
    // this.orderId = orderId;
    // }

    // public Integer getStatusId() {
    // return statusId;
    // }

    // public void setStatusId(Integer statusId) {
    // this.statusId = statusId;
    // }
    // }

    // // Response DTO for order details
    // public static class OrderDetailsResponse {
    // private OrderModel order;
    // private List<OrderDetailModel> orderDetails;

    // public OrderDetailsResponse(OrderModel order, List<OrderDetailModel>
    // orderDetails) {
    // this.order = order;
    // this.orderDetails = orderDetails;
    // }

    // // Getters and Setters
    // public OrderModel getOrder() {
    // return order;
    // }

    // public void setOrder(OrderModel order) {
    // this.order = order;
    // }

    // public List<OrderDetailModel> getOrderDetails() {
    // return orderDetails;
    // }

    // public void setOrderDetails(List<OrderDetailModel> orderDetails) {
    // this.orderDetails = orderDetails;
    // }
    // }
}
