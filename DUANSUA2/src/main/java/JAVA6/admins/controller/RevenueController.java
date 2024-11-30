//package ASMJAVA5.admins.controller;
//
//import org.apache.el.lang.ELArithmetic.BigDecimalDelegate;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Controller;
//import org.springframework.ui.Model;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//
//import ASMJAVA5.service.OrderService;
//
//@Controller
//public class RevenueController {
//
//    private final OrderService orderService;
//
//    @Autowired
//    public RevenueController(OrderService orderService) {
//        this.orderService = orderService;
//    }
//
//    @GetMapping("/revenue")
//    public String showRevenueByMonth(@RequestParam(name = "year", required = false) Integer year,
//                                     @RequestParam(name = "month", required = false) Integer month,
//                                     Model model) {
//        if (year == null || month == null) {
//            // Nếu không có tham số year hoặc month, mặc định hiển thị doanh thu tháng 5/2024
//            year = 2024;
//            month = 5;
//        }
//
//        // Lấy doanh thu theo tháng từ Service
//        BigDecimalDelegate monthlyRevenue = orderService.calculateRevenueByMonth(year, month);
//
//        model.addAttribute("monthlyRevenue", monthlyRevenue);
//        model.addAttribute("selectedMonth", month);
//        model.addAttribute("selectedYear", year);
//
//        return "admin/tong"; // Trả về tên của view JSP để hiển thị
//    }
//}



