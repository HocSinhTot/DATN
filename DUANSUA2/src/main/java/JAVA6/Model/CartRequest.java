package JAVA6.Model;


import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

import lombok.*;
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartRequest {
    private Integer userId;
    private Map<Integer, Integer> cart = new HashMap<>(); // Khởi tạo cart mặc định

    // Getters and setters
}


