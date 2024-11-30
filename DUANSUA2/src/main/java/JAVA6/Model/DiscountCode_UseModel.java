package JAVA6.Model;

import java.math.BigDecimal;
import java.sql.Date;
import jakarta.persistence.*;
import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "DiscountCode_Use")
public class DiscountCode_UseModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @ManyToOne
    @JoinColumn(name = "discountcode_id")
    private DiscountCodeModel discountcodeid;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserModel userId;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private OrderModel orderId;

    @Column(name = "use_date", nullable = false)
    private Date useDate;
}