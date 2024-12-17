package JAVA6.Model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.Date;

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
	private PaymentMethodModel paymentMethod;

	@Column(name = "address", nullable = false)
	private String address;
	@Column(name = "cancel_reason", nullable = true) // Cập nhật kiểu dữ liệu đúng
	private String cancelReason;

	@Column(name = "orderstatus_id", insertable = false, updatable = false)
	private int status; // Trạng thái đơn hàng để kiểm tra
}