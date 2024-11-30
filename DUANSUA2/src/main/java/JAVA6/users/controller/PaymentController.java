//package JAVA6.users.controller;
//
//import org.springframework.stereotype.Controller;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//
//import jakarta.servlet.http.HttpServletResponse;
//
//@Controller
//public class PaymentController {
//
//    @PostMapping("/order/pay")
//    public String processPayment(
//            @RequestParam("userId") Integer userId,
//            @RequestParam("totalAmount") Double totalAmount,
//            @RequestParam("address") String address,
//            @RequestParam("payMethod") Integer payMethod,
//            @RequestParam(value = "username", required = false) String username,
//            @RequestParam(value = "cardPassword", required = false) String cardPassword,
//            HttpServletResponse response) {
//
//        if (payMethod == 2) {
//            // Thực hiện chuyển hướng đến VNPay
//            String vnpayUrl = generateVNPAYUrl(totalAmount, username, cardPassword);
//            return "redirect:" + vnpayUrl;
//        }
//
//        // Xử lý thanh toán khi nhận hàng
//        return "redirect:/index";
//    }
//
//    private String generateVNPAYUrl(Double totalAmount, String username, String cardPassword) {
//        // Tạo URL VNPay với các thông tin thanh toán
//        String vnpayUrl = "https://vnpay.vn/pay?" + 
//            "amount=" + totalAmount + 
//            "&username=" + username + 
//            "&cardPassword=" + cardPassword + 
//            "&returnUrl=" + "http://yourdomain.com/confirmation";
//
//        return vnpayUrl;
//    }
//}
