package JAVA6.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import JAVA6.Model.DiscountCodeModel;
import JAVA6.Model.DiscountCode_UseModel;
import JAVA6.Model.OrderModel;
import JAVA6.Model.UserModel;
import JAVA6.repository.DiscountCodeRepository;

import java.util.List;
import java.util.Optional;

@Service
public class DiscountCodeService {

    @Autowired
    private DiscountCodeRepository discountCodeRepository;

    public List<DiscountCodeModel> getAllDiscountCodes() {
        return discountCodeRepository.findAll();
    }

    public DiscountCodeModel getDiscountCodeById(Integer id) {
        Optional<DiscountCodeModel> discountCode = discountCodeRepository.findById(id);
        return discountCode.orElse(null);
    }

    public DiscountCodeModel createOrUpdateDiscountCode(DiscountCodeModel discountCode) {
        return discountCodeRepository.save(discountCode);
    }

    public void deleteDiscountCode(Integer id) {
        discountCodeRepository.deleteById(id);
    }
      public DiscountCodeModel getDiscountCodeByCode(String code) {
        return discountCodeRepository.findByCode(code);
    }

    // Lưu thông tin mã giảm giá đã sử dụng vào bảng DiscountCode_Use
    // public DiscountCode_UseModel useDiscountCode(String code, int userId, int orderId) {
    //     // Tìm mã giảm giá bằng code
    //     DiscountCodeModel discountCode = discountCodeRepository.findByCode(code);
        
    //     if (discountCode != null) {
    //         // Tạo mới một DiscountCode_UseModel
    //         DiscountCode_UseModel discountCodeUse = new DiscountCode_UseModel();
    //         discountCodeUse.setDiscountcodeid(discountCode);
    //         // Set thông tin người dùng và đơn hàng
    //         discountCodeUse.setUserId(new UserModel(userId)); // Assuming userId is valid
    //         discountCodeUse.setOrderId(1); // Assuming orderId is valid
    //         // Set ngày sử dụng
    //         discountCodeUse.setUseDate(new java.sql.Date(System.currentTimeMillis()));
            
    //         // Lưu vào bảng DiscountCode_Use
    //         return discountCodeUseRepository.save(discountCodeUse);
    //     }
    //     return null;
    // }
}
