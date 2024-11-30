package JAVA6.Model;

import java.math.BigDecimal;
import java.util.Map;

import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {
    
    private int userId;
    private BigDecimal totalAmount;
    private Integer payMethod; // 1: COD, 2: VNPay
    private String address;
    private Map<Integer, Integer> cart; // Cart với key là productId và value là quantity
    private String otp; // Thêm trường OTP để nhận OTP từ frontend

    // Getters and setters
}
