package JAVA6.Model;

import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDate;
import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "DiscountCode")
public class DiscountCodeModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "code", nullable = false)
    private String code;

    @ManyToOne
    @JoinColumn(name = "discount_type_id")
    private DiscountTypeModel discountType;

    @Column(name = "value", nullable = false)
    private BigDecimal value;

    @Column(name = "start_date", nullable = false)
    private Date startDate;

    @Column(name = "end_date", nullable = false)
    private Date endDate;

    // Phương thức này trả về tỷ lệ giảm giá dưới dạng phần trăm
    public BigDecimal getDiscountPercentage() {
        if (discountType != null && discountType.getId() == 1) { // Giả sử 1 là loại giảm giá phần trăm
            return value != null ? value.divide(BigDecimal.valueOf(100)) : BigDecimal.ZERO;
        }
        return BigDecimal.ZERO; // Nếu không phải loại phần trăm, trả về 0
    }

    // Phương thức kiểm tra ngày hết hạn của mã giảm giá
    public boolean isValid() {
        LocalDate currentDate = LocalDate.now(); // Lấy ngày hiện tại
        LocalDate start = startDate.toLocalDate(); // Chuyển startDate sang LocalDate
        LocalDate end = endDate.toLocalDate(); // Chuyển endDate sang LocalDate

        // Kiểm tra xem ngày hiện tại có nằm trong khoảng startDate và endDate không
        return !currentDate.isBefore(start) && !currentDate.isAfter(end);
    }

	public int getDiscountTypeId() {
		// Kiểm tra discountType có null hay không, nếu có trả về 0 hoặc giá trị mặc định khác
		if (discountType != null) {
			return discountType.getId();
		}
		return 0; // Trả về giá trị mặc định nếu discountType là null
	}
	
}
