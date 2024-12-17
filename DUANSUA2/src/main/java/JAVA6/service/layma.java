// package JAVA6.users.controller;

// import JAVA6.Model.DiscountCode_UseModel;
// import JAVA6.Model.UserModel;
// import JAVA6.service.DiscountCodeService;
// import JAVA6.service.UserService;
// import jakarta.servlet.http.HttpSession;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Controller;
// import org.springframework.ui.Model;
// import org.springframework.web.bind.annotation.GetMapping;

// import java.util.List;

// @Controller
// public class LayMaController {

// @Autowired
// private DiscountCodeService discountCodeService;

// @Autowired
// private UserService userService; // Service để lấy thông tin người dùng

// @GetMapping("/lay-ma")
// public String layMaGiảmGia(HttpSession session, Model model) {
// // Retrieve the userId from the session
// Integer userId = (Integer) session.getAttribute("userId");

// // Check if userId is present in the session
// if (userId != null) {
// // Fetch the discount codes for the user using the DiscountCodeService
// List<DiscountCode_UseModel> discountCodes =
// discountCodeService.getDiscountCodesByUserId(userId);

// // Fetch the user information using the UserService
// UserModel user = userService.getUserById(userId);

// // Add the discount codes and user information to the model for displaying in
// // the view
// model.addAttribute("discountCodes", discountCodes);
// model.addAttribute("userName", user.getName()); // Giả sử bạn có trường
// `name` trong `UserModel`
// } else {
// // If userId is not found in the session, redirect to login page or show an
// // error
// model.addAttribute("error", "Vui lòng đăng nhập để xem mã giảm giá.");
// return "redirect:/login"; // Redirect to login page
// }

// // Return the view name where the discount codes will be displayed (e.g.,
// // "layma.html")
// return "layma";
// }
// }