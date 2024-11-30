package JAVA6.users.controller;

import org.springframework.ui.ModelMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import JAVA6.Model.DiscountCodeModel;
import JAVA6.repository.DiscountCodeRepository;

import java.util.List;

@Controller
public class VoucherController {

    @Autowired
    private DiscountCodeRepository discountCodeRepository;

    @GetMapping("/vouchers")
    public String showVoucherList(ModelMap model) {
        // Lấy danh sách voucher từ database
        List<DiscountCodeModel> vouchers = discountCodeRepository.findAll();

        // Thêm dữ liệu vào modelMap
        model.addAttribute("vouchers", vouchers);

        // Trả về view (HTML)
        return "user/voucherList"; // Tên file voucherList.html
    }
}
