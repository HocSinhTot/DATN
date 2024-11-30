package JAVA6.Model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Data
@Entity
@Table(name = "Orders")
public class OrderModel {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private int id;

	@ManyToOne
	@JoinColumn(name = "user_id", nullable = false)
	private UserModel user;

	@Column(name = "date", nullable = false)
	@Temporal(TemporalType.TIMESTAMP)
	private Date date;

	@Column(name = "total", nullable = false)
	private BigDecimal total;

	@ManyToOne
	@JoinColumn(name = "orderstatus_id", nullable = false)
	private OrderStatusModel orderStatus;

    @ManyToOne
    @JoinColumn(name = "paymentmethod_id", nullable = false)
    private PaymentMethodModel paymentMethod;  // Quan hệ với PaymentMethodModel

	@Column(name = "address", nullable = false)
	private String address;



    // Không cần phương thức setPhone() nữa nếu đã có thuộc tính phone
    // Nếu vẫn muốn giữ phương thức setPhone(), có thể sử dụng setter mặc định như sau:
   

    // Getter và setter đã được tạo tự động bởi @Data từ Lombok
}