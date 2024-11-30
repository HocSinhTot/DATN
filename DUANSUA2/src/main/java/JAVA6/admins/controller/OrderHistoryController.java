package JAVA6.admins.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import JAVA6.Model.OrderModel;
import JAVA6.Model.OrderStatusModel;
import JAVA6.repository.OrderStatusRepository;
import JAVA6.service.OrderService;

@Controller
public class OrderHistoryController {

    @Autowired
    private OrderService orderService;
    
    @Autowired
    private OrderStatusRepository orderStatusRepository;

    @RequestMapping("/order")
    public String orderHistory(Model model) {
        List<OrderModel> orders = orderService.getAllOrders();
        model.addAttribute("orders", orders);
        return "admin/orderhistory"; 
    }

    @GetMapping("/editOrderStatus")
    public String editOrderStatus(@RequestParam("id") int orderId, Model model) {
        OrderModel order = orderService.getOrderById(orderId);
        List<OrderStatusModel> orderStatuses = orderStatusRepository.findAll();
        model.addAttribute("order", order);
        model.addAttribute("orderStatuses", orderStatuses);
        return "admin/editOrderStatus";
    }

    @PostMapping("/updateOrderStatus")
    public String updateOrderStatus(@RequestParam("orderId") int orderId, @RequestParam("orderStatusId") int orderStatusId) {
        orderService.updateOrderStatus(orderId, orderStatusId);
        return "redirect:/order";
    }

    @PostMapping("/deleteOrder")
    public String deleteOrder(@RequestParam("orderId") int orderId) {
        orderService.deleteOrder(orderId);
        return "redirect:/order";
    }
}
