package JAVA6.users.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import JAVA6.service.DiscountCodeService;
import JAVA6.Model.DiscountCodeModel;
import JAVA6.Model.DiscountCode_UseModel;
import JAVA6.Request.UseVoucherRequest;

@RestController
@RequestMapping("/api")
public class VoucherController {

    @Autowired
    private DiscountCodeService discountCodeService;

    // API tìm kiếm mã giảm giá theo mã
    @GetMapping("/vouchers/{code}")
    public DiscountCodeModel getVoucherByCode(@PathVariable String code) {
        return discountCodeService.getDiscountCodeByCode(code);
    }

    // API để sử dụng mã giảm giá
    // @PostMapping("/use-voucher")
    // public DiscountCode_UseModel useVoucher(@RequestBody UseVoucherRequest request) {
    //     // Gọi service để lưu thông tin mã giảm giá đã sử dụng
    //     return discountCodeService.useDiscountCode(request.getCode(), request.getUserId(), request.getOrderId());
    // }
}
