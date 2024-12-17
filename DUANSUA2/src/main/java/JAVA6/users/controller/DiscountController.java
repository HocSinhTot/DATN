package JAVA6.users.controller;

import JAVA6.service.DiscountCodeService;
import JAVA6.service.HistoryService;
import JAVA6.service.OrderDetailService;
import JAVA6.service.OrderService; // Đảm bảo import service OrderService
import JAVA6.Model.DiscountCodeModel;
import JAVA6.Model.OrderDetailModel;
import JAVA6.Model.OrderModel;
import JAVA6.repository.DiscountCodeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping; // Đảm bảo import @PutMapping
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
public class DiscountController {

    @Autowired
    private DiscountCodeService discountCodeService;

    @Autowired
    private DiscountCodeRepository discountCodeRepository;
   
    // @PostMapping("/api/discount")
    // public List<OrderModel> getOrdersByUserId(@RequestBody UserRequest userRequest) {
    //     return historyService.getbyIdOrders(userRequest.getUserId());
    // }

   @GetMapping("/api/discount")
public List<DiscountCodeModel> getDiscount() {
    return discountCodeService.getAllDiscountCodes();  // Không truyền tham số
}


    
}
